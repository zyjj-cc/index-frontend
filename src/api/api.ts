import request from "./request.ts";
import {EntityInfo, RelationInfo} from "./model.ts";

const BASE_URL = '/api/v1'

export const UploadFile = async (file: any, name: string = 'tmp.png'): Promise<string> => {
    const formData = new FormData();
    console.log('upload file', file)
    if (file instanceof File) {
        formData.append("file", new Blob([file]), (file as File).name);
    } else if (file instanceof Blob){
        formData.append("file", file, name);
    }
    const key = await request(`${BASE_URL}/file/upload`, formData, 'post_form')
    return `/file/${key}`
}


export const EntityGet = async (entity_id: string): Promise<EntityInfo> => {
    return await request(`${BASE_URL}/entity/${entity_id}`, {}, 'get')
}

export const EntityAdd = async (data: any): Promise<string> => {
    return await request(`${BASE_URL}/entity`, data, 'post')
}

export const EntityDelete = async (entity_id: string): Promise<string> => {
    return await request(`${BASE_URL}/entity/${entity_id}`, {}, 'delete')
}

export const EntityUpdate = async (id: string, data: {name?: string, data?: any}): Promise<string> => {
    return await request(`${BASE_URL}/entity/${id}`, data, 'put')
}

export const EntityTrigger = async (id: string, data: any): Promise<string> => {
    return await request(`${BASE_URL}/entity/${id}/trigger`, data, 'post')
}

export const RelationAdd = async (source: string, target: string, relation_type: number = 1): Promise<string> => {
    return await request(`${BASE_URL}/relation`, {source, target, relation_type}, 'post')
}

export const RelationGetAll = async (relation_type: number = 1): Promise<RelationInfo[]> => {
    return await request(`${BASE_URL}/relation?relation_type=${relation_type}`, {}, 'get')
}
