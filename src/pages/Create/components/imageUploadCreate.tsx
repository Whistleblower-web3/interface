import React from 'react';
import ImgCrop from 'antd-img-crop';
import { cn } from '@/lib/utils';
import { Upload, Space } from 'antd';
import type { UploadFile } from 'antd';
import { useTanStackForm } from '../context/TanStackFormContext';
import TextP from '@/components/base/text_p';
import TextTitle from '@/components/base/text_title';

interface ImageUploadProps {
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ className }) => {
    const form = useTanStackForm();

    const getErrorMessage = (errors: any[]) => {
        return errors.map(err => typeof err === 'string' ? err : (err?.message || String(err))).join(', ');
    };

    const handlePreview = (file: any) => {
        try {
            if (file?.url) {
                window.open(file.url, '_blank');
            } else if (file?.originFileObj) {
                const url = URL.createObjectURL(file.originFileObj);
                window.open(url, '_blank');
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
        } catch (error) {
            console.error('Preview failed:', error);
        }
    };

    return (
        <form.Field 
            name="box_image_list"
            validators={{
                onChange: ({ value }) => {
                    const files = value || [];
                    if (files.length === 0) return 'Please upload a cover image';
                    return undefined;
                }
            }}
        >
            {(field) => {
                const onModalOk = async (value: any) => {
                    try {
                        const file = await Promise.resolve(value);
                        if (file instanceof File) {
                            const size = file.size;
                            if (size > 0.3 * 1024 * 1024) {
                                // For now, we'll just not update the field and let him retry
                                return false; 
                            }

                            const newFileList: UploadFile[] = [{
                                uid: Date.now().toString(),
                                name: file.name || 'image.jpg',
                                status: 'done',
                                url: URL.createObjectURL(file),
                                originFileObj: file as any,
                                size: file.size,
                                type: file.type,
                            }];
                            field.handleChange(newFileList);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                };

                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

                return (
                    <div className={cn("flex flex-col space-y-2", className)}>
                        <TextTitle>Truth Box Image:</TextTitle>
                        <Space direction="vertical" className="w-full">
                            <ImgCrop 
                                rotationSlider 
                                aspect={1 / 1} 
                                onModalOk={onModalOk}
                                modalProps={{
                                    centered: true,
                                    destroyOnHidden: true, 
                                } as any}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={field.state.value || []}
                                    onChange={(info) => field.handleChange(info.fileList)}
                                    onPreview={handlePreview}
                                    maxCount={1}
                                    showUploadList={{
                                        showPreviewIcon: true,
                                        showRemoveIcon: true,
                                        showDownloadIcon: false
                                    }}
                                    accept="image/*"
                                    beforeUpload={() => false}
                                >
                                    {(!field.state.value || field.state.value.length < 1) && '+ Upload'}
                                </Upload>
                            </ImgCrop>
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

export default ImageUpload;