import type { Metadata } from "next";
import "./globals.css";
import MyPage from "@/components/myPage";

export const metadata: Metadata = {
    title: "Audio Queue",
    description: "Generalized cooperative music queue",
};

export default function RootLayout({children,} :Readonly<{children: React.ReactNode;}>){
    return (
        <html lang="en">
            <body>
                <MyPage></MyPage>
                {children}
            </body>
        </html>
    );
}