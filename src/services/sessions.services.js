export class SessionsService {
    async getCurrentSession() {
        return { message: "Sessions service structure active" };
    }
}

export const sessionsService = new SessionsService();
