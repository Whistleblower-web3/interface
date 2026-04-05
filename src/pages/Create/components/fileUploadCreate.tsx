import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Space } from 'antd';
import { useTanStackForm } from '../context/TanStackFormContext';
import { cn } from '@/lib/utils';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

const { Dragger } = Upload;

interface FileUploadProps {
    className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ className }) => {
    const form = useTanStackForm();

    const getErrorMessage = (errors: any[]) => {
        return errors.map(err => typeof err === 'string' ? err : (err?.message || String(err))).join(', ');
    };

    return (
        <form.Field 
            name="file_list"
            validators={{
                onChange: ({ value }) => {
                    const files = value || [];
                    if (files.length === 0) return 'Please upload at least one evidence file';
                    
                    let totalSize = 0;
                    files.forEach((file: any) => {
                        const fileObj = file.originFileObj;
                        if (fileObj) totalSize += fileObj.size;
                        else if (file.size) totalSize += file.size;
                    });
                    
                    if (totalSize > 5 * 1024 * 1024) return 'The total size of the files must be less than 5MB';
                    return undefined;
                }
            }}
        >
            {(field) => {
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                return (
                    <div className={cn("flex flex-col w-full space-y-2", className)}>
                        <TextTitle>Crime Evidence File:</TextTitle>
                        <Space direction="vertical" className="w-full">
                            <Dragger
                                multiple
                                beforeUpload={() => false}
                                onChange={(info) => field.handleChange(info.fileList)}
                                fileList={field.state.value || []}
                                showUploadList={{
                                    showPreviewIcon: true,
                                    showRemoveIcon: true,
                                    showDownloadIcon: false
                                }}
                                accept="application/pdf"
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <TextP size="sm">
                                    Click or drag file to this area to upload
                                    <br />
                                    Support for a single or bulk upload.
                                    Strictly prohibited from uploading company data or other banned files.
                                    <br />
                                    The total size of the files must be less than 5MB.
                                </TextP>
                            </Dragger>
                        </Space>
                        {hasError && (
                            <TextP size="sm" type="error">
                                {getErrorMessage(field.state.meta.errors)}
                            </TextP>
                        )}
                    </div>
                );
            }}
        </form.Field>
    );
}

export default FileUpload;