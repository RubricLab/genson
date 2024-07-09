"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function Profile({ image }: { image: string }) {
	const router = useRouter();
	return (
		<div className="absolute top-0 right-0 px-3 py-2 rounded-bl-md border-b border-l border-border">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className="size-7">
						<AvatarImage src={image} />
						<AvatarFallback>{image.slice(0, 2)}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="mr-7">
					<DropdownMenuItem
						onClick={() => {
							signOut({ callbackUrl: "/" });
							router.refresh();
						}}
					>
						Sign Out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
