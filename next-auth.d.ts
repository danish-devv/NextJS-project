declare module "next-auth"{

    interface Session {
      user: {
        id: string;
        name: string | undefined | null;
        email: string | undefined | null;
        image:string
      };
    }
}

export {}