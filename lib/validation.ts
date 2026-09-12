import {z} from 'zod';
export const credentials=z.object({username:z.string().trim().min(1).max(80),password:z.string().min(6).max(200)});
export const panitiaCredentials=z.object({password:z.string().min(6).max(200)});
export const sectionUpdate=z.object({link:z.union([z.string().url(),z.literal('')]),description:z.string().min(1).max(1000),wallpaperUrl:z.string().max(500).optional(),password:z.string().min(6).max(200).optional()});
export const pddUserCreate=z.object({username:z.string().trim().min(1).max(80).regex(/^[a-zA-Z0-9._-]+$/),name:z.string().trim().min(1).max(120),password:z.string().min(6).max(200)});
export const pddUserUpdate=z.object({username:z.string().trim().min(1).max(80).regex(/^[a-zA-Z0-9._-]+$/).optional(),name:z.string().trim().min(1).max(120).optional()}).refine(value=>Object.keys(value).length>0,{message:'Tidak ada perubahan'});
export const pddPasswordUpdate=z.object({password:z.string().min(6).max(200)});
