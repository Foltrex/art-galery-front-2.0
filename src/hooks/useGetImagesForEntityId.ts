import { useGetAllEntityFilesByEntityId, useGetAllFileStreamByIds } from "../api/FileApi";
import { EntityFileTypeEnum } from "../entities/enums/EntityFileTypeEnum";
import { FileService } from "../services/FileService";

export const useGetImagesForEntityId = (id?: string) => {
	const {data: fileEntities = []} = useGetAllEntityFilesByEntityId(id);

	let fileIds: string[] = [];
	fileEntities.forEach(fileEntity => {
		if (fileEntity.id && fileEntity.type === EntityFileTypeEnum.ORIGINAL) {
			fileIds.push(fileEntity.id);
		}
	});

	const { data: imagesData } = useGetAllFileStreamByIds(fileIds);
	return imagesData?.map(data => FileService.toImage(data)) ?? [];
}