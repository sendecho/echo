type Props = {
	title: string;
	description?: string;
	actions?: React.ReactNode[];
};

export const PageHeader = ({ title, description, actions }: Props) => {
	return (
		<div>
			<h2 className="text-2xl font-bold">{title}</h2>
			{description && <p className="text-gray-500">{description}</p>}
			{actions && <div className="flex gap-2">{actions}</div>}
		</div>
	);
};
