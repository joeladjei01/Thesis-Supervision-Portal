type headerProps = {
    title: string;
    subtitle?: string;
    coloredTitle?: string;
    iconSize?: number;
    Icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const Header = ({ title, iconSize = 25, Icon, coloredTitle, subtitle }: headerProps) => {
    return (
        <div className={"flex items-center gap-3 font-jost mb-6"}>
            {Icon && <Icon size={iconSize} className={"text-secondary"} />}
            <div className={""}>
                <h3 className={"text-2xl font-bold text-primary"}>
                    {title} <span className={"text-primary"}>{coloredTitle}</span>
                </h3>
                <p className={"text-md text-muted-foreground"}>{subtitle}</p>
            </div>


        </div>
    )
}

export default Header