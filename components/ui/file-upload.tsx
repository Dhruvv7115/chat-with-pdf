"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { AttachmentProgressRing } from "@/components/ui/attachment";
import { Check, FileText, Loader2 } from "lucide-react";

const mainVariant = {
	initial: {
		x: 0,
		y: 0,
	},
	animate: {
		x: 20,
		y: -20,
		opacity: 0.9,
	},
};

const secondaryVariant = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
};

export const FileUpload = ({
	onChange,
	progress,
	uploadState = "idle",
}: {
	onChange?: (files: File[]) => void;
	progress?: number;
	uploadState?: "idle" | "uploading" | "processing" | "done" | "error";
}) => {
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (newFiles: File[]) => {
		setFiles(newFiles);
		onChange && onChange(newFiles);
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const { getRootProps, isDragActive } = useDropzone({
		multiple: false,
		noClick: true,
		onDrop: handleFileChange,
		onDropRejected: (error) => {
			console.log(error);
		},
	});

	const isUploading =
		uploadState === "uploading" || (progress !== undefined && progress < 100);
	const isProcessing = uploadState === "processing";
	const isDone = uploadState === "done" || (progress === 100 && !isProcessing);

	return (
		<div
			className="w-full"
			{...getRootProps()}
		>
			<motion.div
				onClick={handleClick}
				whileHover="animate"
				className="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10"
			>
				<input
					ref={fileInputRef}
					id="file-upload-handle"
					type="file"
					onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
					className="hidden"
					accept=".pdf,.txt,.md,.docx,.doc,.csv"
				/>
				<div className="absolute inset-0 mask-[radial-gradient(ellipse_at_center,white,transparent)]">
					<GridPattern />
				</div>
				<div className="flex flex-col items-center justify-center">
					<p className="relative z-20 font-sans text-lg font-bold text-neutral-700 dark:text-neutral-300">
						Drop your PDF or document
					</p>
					<p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
						Drag and drop your files here or click to upload
					</p>
					<div className="relative mx-auto mt-10 w-full max-w-xl">
						{files.length > 0 &&
							files.map((file, idx) => (
								<motion.div
									key={"file" + idx}
									layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
									className={cn(
										"relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900",
										"shadow-sm",
									)}
								>
									<div className="flex w-full items-center justify-between gap-4">
										<div className="flex items-center gap-3 min-w-0">
											<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
												{isUploading ? (
													<AttachmentProgressRing
														value={progress ?? 0}
														size={24}
														strokeWidth={2.5}
													/>
												) : isProcessing ? (
													<Loader2 className="size-5 animate-spin text-muted-foreground" />
												) : isDone ? (
													<Check className="size-5 text-emerald-500" />
												) : (
													<FileText className="size-5 text-neutral-600 dark:text-neutral-300" />
												)}
											</div>
											<div className="min-w-0 flex-1">
												<motion.p
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													layout
													className="truncate text-base font-medium text-neutral-800 dark:text-neutral-200"
												>
													{file.name}
												</motion.p>
												<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
													{isUploading
														? `Uploading • ${progress ?? 0}%`
														: isProcessing
															? "Validating document..."
															: isDone
																? "Ready"
																: `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
												</p>
											</div>
										</div>

										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											layout
											className="shrink-0 rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
										>
											{(file.size / (1024 * 1024)).toFixed(2)} MB
										</motion.p>
									</div>

									{/* Progress bar line if uploading */}
									{isUploading && (
										<div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
											<motion.div
												className="h-full bg-primary"
												initial={{ width: 0 }}
												animate={{ width: `${progress ?? 0}%` }}
												transition={{ duration: 0.2 }}
											/>
										</div>
									)}

									<div className="mt-2 flex w-full flex-col items-start justify-between text-xs text-neutral-500 md:flex-row md:items-center dark:text-neutral-400">
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											layout
											className="rounded-md bg-gray-100 px-1.5 py-0.5 uppercase tracking-wider text-[10px] font-semibold dark:bg-neutral-800"
										>
											{file.name.split(".").pop() || file.type}
										</motion.p>

										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											layout
										>
											modified{" "}
											{new Date(file.lastModified).toLocaleDateString()}
										</motion.p>
									</div>
								</motion.div>
							))}
						{!files.length && (
							<motion.div
								layoutId="file-upload"
								variants={mainVariant}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 20,
								}}
								className={cn(
									"relative z-40 mx-auto mt-4 flex h-32 w-full max-w-32 items-center justify-center rounded-md bg-white group-hover/file:shadow-2xl dark:bg-neutral-900",
									"shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
								)}
							>
								{isDragActive ? (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="flex flex-col items-center text-neutral-600"
									>
										Drop it
										<IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
									</motion.p>
								) : (
									<IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
								)}
							</motion.div>
						)}

						{!files.length && (
							<motion.div
								variants={secondaryVariant}
								className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent opacity-0"
							></motion.div>
						)}
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export function GridPattern() {
	const columns = 41;
	const rows = 11;
	return (
		<div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-gray-100 dark:bg-neutral-900">
			{Array.from({ length: rows }).map((_, row) =>
				Array.from({ length: columns }).map((_, col) => {
					const index = row * columns + col;
					return (
						<div
							key={`${col}-${row}`}
							className={`flex h-10 w-10 shrink-0 rounded-[2px] ${
								index % 2 === 0
									? "bg-gray-50 dark:bg-neutral-950"
									: "bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
							}`}
						/>
					);
				}),
			)}
		</div>
	);
}
