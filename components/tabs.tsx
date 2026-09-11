"use client";

import { createContext, useContext } from "react";
import { motion, MotionConfig, Transition } from "motion/react";
import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";

const transition: Transition = {
	type: "spring",
	stiffness: 170,
	damping: 24,
	mass: 1.2,
};

type TabsContextType = {
	value: string;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

type TabsProviderProps = {
	children: React.ReactNode;
	value: string;
};

function TabsProvider({ children, value }: TabsProviderProps) {
	return (
		<TabsContext.Provider value={{ value }}>{children}</TabsContext.Provider>
	);
}

function useTabs() {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error("useTabs must be used within a TabsProvider");
	}
	return context;
}

interface TabsProps {
	value: string;
	onValueChange: (value: string) => void;
	children: React.ReactNode;
	className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
	return (
		<MotionConfig transition={transition}>
			<TabsProvider value={value}>
				<TabsPrimitive.Root
					value={value}
					onValueChange={onValueChange}
					className={cn("relative", className)}
				>
					{children}
				</TabsPrimitive.Root>
			</TabsProvider>
		</MotionConfig>
	);
}

const TabsList = ({
	className,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.List>) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			"inline-flex flex-wrap w-fit items-center justify-start overflow-hidden rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800",
			className,
		)}
		{...props}
	/>
);

const TabsTrigger = ({
	className,
	children,
	ref,
	...props
}: React.ComponentPropsWithRef<typeof TabsPrimitive.Trigger>) => {
	const { value: tabValue } = useTabs();
	const isActive = tabValue === props.value;

	return (
		<div className="relative">
			{isActive && (
				<motion.div
					layoutId="active-tab-bg"
					style={{ borderRadius: 8 }}
					className="absolute inset-0 rounded-lg bg-primary shadow-[rgba(0,0,0,0.04)_0px_1px_6px] dark:shadow-[rgba(0,0,0,0.2)_0px_1px_6px]"
				/>
			)}
			<TabsPrimitive.Trigger
				ref={ref}
				className={cn(
					"relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-transparent px-3 py-1.5 text-sm font-medium text-black dark:text-white transition-none transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-black hover:data-[state=inactive]:opacity-70 cursor-pointer",
					className,
				)}
				{...props}
			>
				{children}
			</TabsPrimitive.Trigger>
		</div>
	);
};

const TabsContent = ({
	className,
	ref,
	value,
	...props
}: {
	className: string;
	ref: React.Ref<HTMLDivElement> | undefined;
	value: string;
}) => (
	<TabsPrimitive.Content
		value={value}
		ref={ref}
		className={cn(
			"focus-visible:ring-ring relative mt-2 rounded-xl border border-muted ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
			className,
		)}
		{...props}
	/>
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
