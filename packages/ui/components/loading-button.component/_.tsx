"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { LoadingIcon } from "@repo/ui/icons";
import {clsx} from "../../helpers";

export type LoadingButtonComponentProps =
	ButtonHTMLAttributes<HTMLButtonElement> & {
		isLoading: boolean;
	};

const LoadingButtonComponent = forwardRef<
	HTMLButtonElement,
	LoadingButtonComponentProps
>(({ children, isLoading, ...props }, ref) => {
	const { className, ...rest } = props;
	return (
		<button
			ref={ref}
			type="button"
			className={clsx("btn btn-primary relative", className)}
			disabled={isLoading}
			{...rest}
		>
			<span className={isLoading ? "invisible" : "visible"}>{children}</span>
			{isLoading && (
				<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<LoadingIcon />
				</span>
			)}
		</button>
	);
});

LoadingButtonComponent.displayName = "LoadingButtonComponent";

export default LoadingButtonComponent;
