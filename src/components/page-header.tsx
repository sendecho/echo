type Props = {
	title: string;
	description?: string;
	actions?: React.ReactNode[];
};

export const PageHeader = ({ title, description, actions }: Props) => {
	return (
		<div className="flex justify-between items-center">
			<div>
				<h1 className="text-3xl font-bold">{title}</h1>
				{description && <p className="text-gray-500">{description}</p>}
			</div>
			{actions && <div className="flex gap-2">{actions}</div>}
		</div>
	);
};