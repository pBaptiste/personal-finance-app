import type { Route } from "./+types/budget";

export function Meta({}: Route.MetaArgs){
    return [
        {
            title: "Budget - Personal Finance App"
        },
        {
            name: "description",
            content: "View and manage your budget"
        }
    ];
}

export default function Budget() {
    return (
        <div>
            <h1>Budgets</h1>
        </div>
    )
}

