import React from "react";
import type { Editor } from "@tiptap/core";
import { BracesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const variables = [
	{ label: "First Name", value: "first_name", default: "there" },
	{ label: "Last Name", value: "last_name", default: "friend" },
	{ label: "Email", value: "email", default: "valued customer" },
	// Add more variables as needed
];

const VariableSelector = ({ editor }: { editor: Editor }) => {
	const insertVariable = (variable: (typeof variables)[0]) => {
		const variableText = `{{${variable.value}|${variable.default}}}`;
		editor.chain().focus().insertContent(variableText).run();
		console.log("Inserted variable:", variableText);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-9 w-9 p-0" title="Insert variable">
					<BracesIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{variables.map((variable) => (
					<DropdownMenuItem
						key={variable.value}
						onSelect={() => insertVariable(variable)}
					>
						{variable.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default VariableSelector;
