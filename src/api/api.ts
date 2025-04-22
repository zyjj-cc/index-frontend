import request from "./request.ts";

const BASE_URL = 'http://127.0.0.1:9000/api/v1'

export const UploadFile = async (file: File): Promise<String> => {
    const formData = new FormData();
    formData.append('file', file);
    const key = await request(`${BASE_URL}/file/upload`, formData, 'post_form')
    return `${BASE_URL}/file/${key}`
}

