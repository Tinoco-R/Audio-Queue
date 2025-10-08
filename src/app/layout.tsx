import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import MyPage from "@/components/myPage";
import "./globals.css";

const metadata: Metadata = {
    title: "Audio Queue",
    description: "Generalized cooperative music queue",
};

export default function RootLayout({children,} :Readonly<{children: React.ReactNode;}>){
    return (
        <html lang="en">
            <body>
                <MyPage></MyPage>
                {children}
                <SpeedInsights />
            </body>
        </html>
    );
}