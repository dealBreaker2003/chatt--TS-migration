

export const handleFallBacks = async (Ids: string[], Blobs: Blob[]): Promise<void> => {
    //  空置处理
    if (!Array.isArray(Ids) || !Array.isArray(Blobs) || Ids.length === 0) {
        throw new Error('传入数组错误: Ids 或 Blobs 格式不正确或为空');
    }

    if (Ids.length !== Blobs.length) {
        throw new Error(`id和blob数量不一致,id:${Ids.length},blob:${Blobs.length}`);
    }

    //  初始化信息
    const formData = new FormData();
    const token = localStorage.getItem('token');

    //  数据装车上传
    formData.append('imageIds', JSON.stringify(Ids));
    for (const blob of Blobs) {
        formData.append('fallbacks', blob);
    }
    try {
        const response = await fetch(
            'http://scj.dolmo.top:3001/api/chat/upload-fallbacks',
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            },
        );

        //  服务器响应
        if (!response.ok) {
            throw new Error(`服务响应错误:${response.status}`);
        }
        //  数据存储
        const data = await response.json();
        if (!data.success) {
            throw new Error(`服务器存储失败：${data.message}`);
        }
    } catch (error: any) {
        //  异常处理
        if (error instanceof Error) {
            console.error("上传错误:", error.message);
        }
        //  向外抛出
        throw error
    }
};
