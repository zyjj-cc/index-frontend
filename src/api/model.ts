export interface EntityInfo {
	create_time: number;
	data: any;
	entity_type: number;
	id: string;
	name: string;
	update_time: number;
}


export interface RelationInfo {
	in: RelationEntity;
	out: RelationEntity;
	relation_type: number;
}

export interface RelationEntity {
	entity_type: number;
	id: string;
	name: string;
}
