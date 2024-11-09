import { MarginProps, Card as RadixCard } from "@radix-ui/themes";

export interface CardProps extends React.ComponentPropsWithoutRef<'div'>, MarginProps {
    asChild?: boolean;
}

export const Card = (props: CardProps) => {
    const { children } = props
    return <RadixCard>
        {children}
    </RadixCard>
}