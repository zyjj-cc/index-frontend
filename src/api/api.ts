import request from "./request.ts";
import {EntityInfo, PageData, RelationEntity, RelationInfo} from "./model.ts";

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

export const EntityGetList = async (
    page_no: number,
    page_size: number,
    name?: string,
    entity_type?: number,
): Promise<PageData<EntityInfo>> => await request(`${BASE_URL}/entity`, {
    page_no,
    page_size,
    name,
    entity_type,
}, 'get')

export const EntityGet = async (entity_id: string): Promise<EntityInfo> => await request(`${BASE_URL}/entity/${entity_id}`, {}, 'get')

export const EntityAdd = async (data: any): Promise<string> => await request(`${BASE_URL}/entity`, data, 'post')

export const EntityDelete = async (entity_id: string): Promise<string> => await request(`${BASE_URL}/entity/${entity_id}`, {}, 'delete')

export const EntityUpdate = async (id: string, data: {name?: string, data?: any, desc?: any}): Promise<string> => await request(`${BASE_URL}/entity/${id}`, data, 'put')

export const EntityTrigger = async (id: string, data: any): Promise<string> => await request(`${BASE_URL}/entity/${id}/trigger`, data, 'post')

export const EntitySearch = async (keyword: string): Promise<EntityInfo[]> => await request(`${BASE_URL}/entity/search`, {keyword}, 'get')

export const RelationAdd = async (source: string, target: string, relation_type: number = 1): Promise<string> => await request(`${BASE_URL}/relation`, {source, target, relation_type}, 'post')

export const RelationGetAll = async (relation_type: number = 1): Promise<RelationInfo[]> => await request(`${BASE_URL}/relation?relation_type=${relation_type}`, {}, 'get')

export const RelationGet = async (entity_id: string): Promise<{info: RelationEntity, children: RelationEntity[]}> => await request(`${BASE_URL}/relation/${entity_id}`, {}, 'get')

export const RelationUpdate = async (node_id: string, old_id: string, new_id: string) => await request(`${BASE_URL}/relation/${node_id}`, {old_id, new_id}, 'put')
