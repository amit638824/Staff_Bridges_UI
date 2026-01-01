import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { masterDocumentsService } from '@/services/masterData';
import { useSession } from '@/hooks/useSession';
import Loader from '../loader/Loader';
import { FaCheckCircle, FaUpload, FaTimesCircle } from 'react-icons/fa';
import { showAlert } from '@/utils/swalFire';
import { recruiterAllUploadedDocDocument, recruiterDocumentUpload } from '@/services/RecruiterService';

interface DocumentType {
    id: number;
    name: string;
    fieldName: string;
}

interface MasterDocument {
    id: number;
    name: string;
    image: string;
    description: string;
    status: number;
    createdAt: string;
}

interface UploadedDocument {
    id: number;
    document: string | null;
    isverified: number;
    userid: number;
    jobid: number | null;
    documentname: string | null;
    description: string | null;
}

interface DocumentFile {
    file: File;
    uploaded: boolean;
    uploading: boolean;
    error?: string;
    uploadedDocumentId?: number;
    alreadyExists?: boolean;
}

interface RecruiterDocumentUploadModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

const ALLOWED_DOCUMENTS: DocumentType[] = [
    { id: 1, name: 'MSME Registration Certificate', fieldName: 'msmeCertificate' },
    { id: 2, name: 'Shop & Establishment Certificate', fieldName: 'shopEstablishmentCertificate' },
    { id: 3, name: 'Company Incorporation Certificate', fieldName: 'companyIncorporationCertificate' },
    { id: 4, name: 'FSSAI License', fieldName: 'fssaiLicense' },
    { id: 5, name: 'Company GST Certificate', fieldName: 'gstCertificate' },
    { id: 6, name: 'PAN Card', fieldName: 'panCard' }
];

export default function RecruiterDocumentUploadModal({
    show,
    onHide,
    onSuccess
}: RecruiterDocumentUploadModalProps) {
    const session = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Record<number, DocumentFile>>({});
    const [userId, setUserId] = useState<number | null>(null);
    const [masterDoc, setMasterDoc] = useState<MasterDocument[]>([]);
    const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

    useEffect(() => {
        if (session?.user?.user_id) {
            setUserId(session?.user?.user_id);
        }
    }, [session]);

    useEffect(() => {
        if (show) {
            fetchMasterDocuments();
            setFormData({});
        }
    }, [show]);

    useEffect(() => {
        if (userId) {
            fetchUploadedDoc();
        }
    }, [userId]);

    const fetchUploadedDoc = async () => {
        try {
            if (!userId) return;

            const response = await recruiterAllUploadedDocDocument(userId);
            if (response?.success && response?.data?.items) {
                setUploadedDocuments(response.data.items);
                const alreadyUploadedDocs: Record<number, DocumentFile> = {};

                response.data.items.forEach((doc: UploadedDocument) => {
                    const matchedMasterDoc = masterDoc.find(master =>
                        master.name.toLowerCase() === (doc.documentname || '').toLowerCase()
                    );

                    if (matchedMasterDoc) {
                        alreadyUploadedDocs[matchedMasterDoc.id] = {
                            file: new File([], ''),
                            uploaded: true,
                            uploading: false,
                            alreadyExists: true,
                            uploadedDocumentId: doc.id
                        };
                    }
                });

                if (Object.keys(alreadyUploadedDocs).length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        ...alreadyUploadedDocs
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching uploaded documents:", error);
        }
    };

    const fetchMasterDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await masterDocumentsService();

            if (response?.success && response?.data?.items) {
                const filteredDocs = response.data.items.filter((doc: MasterDocument) =>
                    ALLOWED_DOCUMENTS.some(allowedDoc =>
                        doc.name.toLowerCase().includes(allowedDoc.name.toLowerCase().split(' ')[0])
                    )
                );
                setMasterDoc(filteredDocs);
                if (userId) {
                    await fetchUploadedDoc();
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch documents');
            showAlert('error', 'Failed to load documents. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docId: number, docName: string) => {
        const isAlreadyUploaded = uploadedDocuments.some(doc => {
            const masterDocItem = masterDoc.find(m => m.id === docId);
            return masterDocItem &&
                (doc.documentname || '').toLowerCase() === masterDocItem.name.toLowerCase();
        });

        if (isAlreadyUploaded) {
            showAlert('info', 'This document is already uploaded. You cannot upload it again.');
            e.target.value = '';
            return;
        }

        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

            if (!validTypes.includes(fileExtension)) {
                setFormData(prev => ({
                    ...prev,
                    [docId]: {
                        file,
                        uploaded: false,
                        uploading: false,
                        error: 'Invalid file format. Please upload PDF, JPG, PNG, or DOC files only.'
                    }
                }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setFormData(prev => ({
                    ...prev,
                    [docId]: {
                        file,
                        uploaded: false,
                        uploading: false,
                        error: 'File size too large. Maximum size is 5MB.'
                    }
                }));
                return;
            }
            setFormData(prev => ({
                ...prev,
                [docId]: {
                    file,
                    uploaded: false,
                    uploading: false,
                    alreadyExists: false,
                    error: undefined
                }
            }));
        }
    };

    const uploadSingleDocument = async (docId: number) => {
        if (!userId || !formData[docId]?.file) {
            showAlert('warning', 'Please select a file first.');
            return;
        }

        try {
            setFormData(prev => ({
                ...prev,
                [docId]: {
                    ...prev[docId],
                    uploading: true,
                    error: undefined,
                    alreadyExists: false
                }
            }));

            const formDataToSend = new FormData();
            formDataToSend.append('userId', userId.toString());
            formDataToSend.append('documentId', docId.toString());
            formDataToSend.append('file', formData[docId].file);
            formDataToSend.append('createdBy', userId.toString());

            const response = await recruiterDocumentUpload(formDataToSend);

            if (response?.code === 201 && response?.success) {
                // Successfully created (201)
                setFormData(prev => ({
                    ...prev,
                    [docId]: {
                        ...prev[docId],
                        uploaded: true,
                        uploading: false,
                        uploadedDocumentId: response.data?.id,
                        alreadyExists: false
                    }
                }));

                const docName = masterDoc.find(d => d.id === docId)?.name || 'Document';
                showAlert('success', `${docName} uploaded successfully!`, response.message);

                // Refresh uploaded documents list
                await fetchUploadedDoc();

            } else if (response?.code === 409 && response?.success) {
                // Document already exists (409)
                setFormData(prev => ({
                    ...prev,
                    [docId]: {
                        ...prev[docId],
                        uploaded: true,
                        uploading: false,
                        alreadyExists: true
                    }
                }));

                const docName = masterDoc.find(d => d.id === docId)?.name || 'Document';
                showAlert('info', `${docName} already uploaded`, response.message);

                // Refresh uploaded documents list
                await fetchUploadedDoc();

            } else {
                // Other error cases
                throw new Error(response?.message || 'Upload failed');
            }

        } catch (err: any) {
            console.error("Upload error details:", err);

            let errorMessage = 'Failed to upload document';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setFormData(prev => ({
                ...prev,
                [docId]: {
                    ...prev[docId],
                    uploading: false,
                    error: errorMessage,
                    alreadyExists: false
                }
            }));

            showAlert('error', `Failed to upload: ${errorMessage}`);
        }
    };

    // Check if a document is already uploaded
    const isDocumentAlreadyUploaded = (docId: number) => {
        const masterDocItem = masterDoc.find(d => d.id === docId);
        if (!masterDocItem) return false;

        return uploadedDocuments.some(doc =>
            (doc.documentname || '').toLowerCase() === masterDocItem.name.toLowerCase()
        );
    };

    return (
        <>
            {loading && <Loader />}

            <Modal show={show} onHide={onHide} size="lg" backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Required Documents</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <Form>
                        {masterDoc?.map((doc) => {
                            const docData = formData[doc.id];
                            const hasFile = !!docData?.file;
                            const isAlreadyUploaded = isDocumentAlreadyUploaded(doc.id);

                            return (
                                <div key={doc.id} className="mb-4 p-3 border rounded">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="fw-bold mb-0">
                                            {doc.name}
                                            {(docData?.uploaded || isAlreadyUploaded) && (
                                                <span className="text-success ms-2">
                                                    <FaCheckCircle />
                                                </span>
                                            )}
                                        </Form.Label>
                                        <div>
                                            {(docData?.uploaded && docData?.alreadyExists) || isAlreadyUploaded ? (
                                                <span className="text-info me-2">
                                                    <FaCheckCircle /> Already Uploaded
                                                </span>
                                            ) : docData?.uploaded && !docData?.alreadyExists ? (
                                                <span className="text-success me-2">
                                                    <FaCheckCircle /> Uploaded
                                                </span>
                                            ) : docData?.uploading ? (
                                                <span className="text-primary me-2">
                                                    <Loader /> Uploading...
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <Form.Control
                                            type="file"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleFileChange(e, doc.id, doc.name)}
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            disabled={
                                                isAlreadyUploaded ||
                                                docData?.uploaded ||
                                                docData?.uploading
                                            }
                                            title={isAlreadyUploaded ? "This document is already uploaded" : ""}
                                        />

                                        {hasFile && !docData.uploaded && !docData.uploading && !isAlreadyUploaded && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => uploadSingleDocument(doc.id)}
                                                disabled={!hasFile || docData?.uploaded || isAlreadyUploaded}
                                            >
                                                {docData?.uploading ? (
                                                    <>
                                                        <Loader /> Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUpload /> Upload
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>

                                    {docData?.error && (
                                        <div className="text-danger mt-2">
                                            <FaTimesCircle /> {docData.error}
                                        </div>
                                    )}

                                    <Form.Text className="text-muted">
                                        {isAlreadyUploaded ? (
                                            <span className="text-success">
                                                ✓ This document has already been uploaded
                                            </span>
                                        ) : (
                                            "Accepted formats: PDF, JPG, PNG, DOC (Max: 5MB)"
                                        )}
                                    </Form.Text>

                                    {hasFile && !docData?.error && !isAlreadyUploaded && (
                                        <div className="mt-2">
                                            <small className="text-muted">
                                                Selected: {docData.file.name}
                                                ({(docData.file.size / 1024 / 1024).toFixed(2)} MB)
                                            </small>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            onSuccess?.();
                            onHide();
                        }}
                        disabled={loading}
                    >
                        {loading ? <Loader /> : 'Done'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}