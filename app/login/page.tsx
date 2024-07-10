import { Button } from "rubricui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/auth";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function LoginForm() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="max-w-sm w-full gap-3 flex flex-col">
        <h1 className="w-full opacity-80">Genson</h1>
        <p>
          <span className="opacity-60">
            Genson is a generative UI web app that allows users to leverage the
            abilities of
          </span>{" "}
          <span className="opacity-80">Claude-3.5-sonnet</span>{" "}
          <span className="opacity-60">
            to generate UI using typesafe JSON.
          </span>
        </p>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Please login to access <span className="font-medium">Genson</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <Button className="w-full py-1.5">
                <svg viewBox="0 0 128 128" width="14" height="14">
                  <title>Google</title>
                  <path
                    fill="#fff"
                    d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"
                  />
                  <path
                    fill="#e33629"
                    d="M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z"
                  />
                  <path
                    fill="#f8bd00"
                    d="M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z"
                  />
                  <path
                    fill="#587dbd"
                    d="M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z"
                  />
                  <path
                    fill="#319f43"
                    d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="flex items-center gap-2 justify-between">
          <div className="opacity-50">
            {" "}
            A{" "}
            <Link
              target="_blank"
              href="https://rubriclabs.com"
              className="underline underline-offset-4 hover:opacity-80"
            >
              Rubric Labs
            </Link>
            &apos; project
          </div>
          <Link
            target="_blank"
            href="https://github.com/RubricLab/genson"
            className="hover:opacity-80"
          >
            <GitHubLogoIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
