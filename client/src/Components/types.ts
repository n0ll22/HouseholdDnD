export const apiUrl = "http://localhost:8000";

export interface Task {
    _id: string;
    title: string;
    exp: number;
    description: string;
    tutorial: string[];
}

export interface Notifications {
    title: string;
    body: {
        message: string;
    };
    date: string;
    senderAvatar: string;
    senderUsername: string;
    read: boolean;
}

export interface User {
    _id: string;
    username: string;
    avatar: string;
    exp: number;
    lvl: number;
    taskToday: number[];
    comrades: string[];
    pendingComrade: [
        {
            userId: string;
            sender: string;
        }
    ];
    description: string;
    banner: string;
}

export interface ExtendedUser {
    avatarDiv: JSX.Element;
    username: string;
    lvl: number;
    _id: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface UserProp {
    users: User[];
}

export interface Levels {
    exp: number;
    level: number;
}
