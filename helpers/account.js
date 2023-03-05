const SessionActive = async () => {
    const request = await fetch("/api/session/active", { method: "POST" });
    const response = await request.json();

    if (response.session === 'active')
        return { session: true, avatar: response?.avatar || null };
    
    return { session: false };
};

export { SessionActive };