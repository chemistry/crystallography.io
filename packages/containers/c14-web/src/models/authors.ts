interface AuthorsContentResponse {
    meta: { pages: number; total: number };
    data: [
        {
            id: number;
            type: string;
            attributes: {
                count: number;
                full: string;
                updated: string;
            };
        }
    ];
}

export const getAuthorsList = async (
    pageQ: number
): Promise<AuthorsContentResponse> => {

    const response = await fetch(
        `https://crystallography.io/api/v1/authors?page=${pageQ}`,
        {
            method: "GET",
        }
    );
    return await response.json();
};
