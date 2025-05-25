import { createImageUpload } from "novel";
import { toast } from "sonner";
import {UploadFile} from "../../api/api.ts";

const onUpload = (file: File) => {
    return new Promise((resolve, reject) => {
        toast.promise(
            UploadFile(file).then(resolve),
            {
                loading: "正在上传...",
                success: "上传成功!",
                error: (e) => {
                    reject(e);
                    return e.message;
                },
            },
        );
    });
};

export const uploadFn = createImageUpload({
    onUpload,
    validateFn: (file) => {
        if (!file.type.includes("image/")) {
            toast.error("File type not supported.");
            return false;
        }
        if (file.size / 1024 / 1024 > 20) {
            toast.error("File size too big (max 20MB).");
            return false;
        }
        return true;
    },
});
