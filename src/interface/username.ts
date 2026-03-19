export interface CreateUsernameBody {
  username: string;
}

export interface Username {
  id: number;
  username: string;
  createdAt: string;
}

export interface ErrorResponse {
  message: string;
}

export interface CreateUsernameRoute {
  Body: CreateUsernameBody;
  Reply: Username | ErrorResponse;
}

export interface ListUsernamesRoute {
  Reply: Username[];
}
