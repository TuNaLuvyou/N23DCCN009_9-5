import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

async function refreshAccessToken(refreshToken) {
  try {
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          accessToken: "new_access_token_" + Date.now(),
          refreshToken: refreshToken,
          accessTokenExpires: Date.now() + 60 * 1000,
        });
      }, 500);
    });
    return response;
  } catch (error) {
    console.error("Lỗi refresh token:", error);
    return null;
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const users = [
          {
            id: "1",
            username: "student",
            password: "123456",
            role: "ROLE_STUDENT",
          },
          {
            id: "2",
            username: "advisor",
            password: "123456",
            role: "ROLE_ADVISOR",
          },
        ];

        const user = users.find(
          (u) =>
            u.username === credentials.username &&
            u.password === credentials.password
        );

        if (!user) return null;

        return {
          id: user.id,
          username: user.username,
          role: user.role,
          accessToken: "access_token_" + Date.now(),
          refreshToken: "refresh_token_" + Date.now(),
          accessTokenExpires: Date.now() + 60 * 1000,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      console.log("🔄 Token hết hạn, đang refresh...");
      const refreshedToken = await refreshAccessToken(token.refreshToken);

      if (!refreshedToken) {
        token.error = "RefreshTokenExpired";
        return token;
      }

      return {
        ...token,
        accessToken: refreshedToken.accessToken,
        refreshToken: refreshedToken.refreshToken,
        accessTokenExpires: refreshedToken.accessTokenExpires,
      };
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
