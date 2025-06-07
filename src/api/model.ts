export interface PageData<T> {
	total: number;
	list: T[];
}

export interface EntityInfo {
	id: string;
	entity_type: number;
	data: any;
	name: string;
	desc: string;
	create_time: number;
	update_time: number;
}


export interface RelationInfo {
 	in: RelationEntity;
	out: RelationEntity;
	relation_type: number;
}

export interface RelationEntity {
	entity_type: number;
	relation_type: number;
	id: string;
	name: string;
}
