import { Modal } from "antd";
import Loader from "./Loader/index";
import TextP from "@/components/base/text_p";
// import { FaSpinner } from "react-icons/fa";

interface LoaderModalProps {
    title?: string;
    open: boolean;
    closable?: boolean;
    onCancel?: () => void;
}

export function LoaderModal({ open, closable = false, onCancel, title = 'Loading...' }: LoaderModalProps) {
    return (
        <Modal 
        open={open} 
        footer={null} 
        closable={closable} 
        onCancel={onCancel}
        maskClosable={false}
        centered
        width={600}
        >
            <div className="flex flex-col justify-center items-center gap-4 h-full">
                <TextP className="mb-4">{title}</TextP>
                <div className="flex justify-center items-center">
                    <Loader />
                </div>
            </div>
        </Modal>
    )
}