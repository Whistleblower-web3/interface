import React from 'react';
import { Typography, Card, Space } from 'antd';
import { ipfsCidToUrl } from '@/services/ipfsUrl/ipfsCidToUrl';
import CopyText from './base/copyText';

const { Text } = Typography;

export interface ParagraphListProps {
    label: string;
    type: 'text' | 'password' | 'cid' | 'url';
    cidList: string[];
    className?: string;
}

/**
 * Simple text list display component
 */
const ParagraphList: React.FC<ParagraphListProps> = ({
    label,
    type,
    cidList = [],
    className,
}) => {
    /**
     * Get the text that should be copied
     */
    const getCopyText = (text: string): string => {
        if (!text) return '';
        if (type === 'cid') {
            try {
                return ipfsCidToUrl(text);
            } catch (error) {
                console.error('Failed to convert CID to URL:', error);
            }
        }
        return text;
    };

    /**
     * Format display text
     */
    const formatDisplayText = (text: string): string => {
        if (type === 'password' && text) {
            return '•'.repeat(Math.min(text.length, 12));
        }
        return text;
    };

    if (cidList.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            <Card className="shadow-sm">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text strong className="text-[13px] font-mono opacity-80">{label}:</Text>
                    {cidList.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 group p-1 hover:bg-white/5 rounded-md transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <Text 
                                    className="block truncate text-[13px] font-mono opacity-90"
                                    title={item}
                                >
                                    {formatDisplayText(item)}
                                </Text>
                            </div>
                            <CopyText 
                                text={getCopyText(item)} 
                                className="shrink-0"
                                iconSize={14}
                            />
                        </div>
                    ))}
                </Space>
            </Card>
        </div>
    );
};

export default ParagraphList;
