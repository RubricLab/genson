export default function IDBox({ id }: { id: string }) {
	return (
		<div className="group-hover:flex flex size-5 text-xs bg-zinc-700/50 text-zinc-500 rounded-sm m-1 border border-zinc-700/50 absolute bottom-0 right-0 text-center items-center justify-center">
			{id.slice(3)}
		</div>
	);
}
