export interface CompanyAnnouncement {
    id: number;
    title: string;
    data: string;
    created_at: string;
    author_id: number;
}

export interface CompanyAnnouncement_Request {
    id?: number;
    title?: string;
    data?: string;
    created_at?: string;
    author_id?: number;
}

export interface UpdateUserAnnouncements {
    userId: number;
    companyAnnouncementId: number;
}