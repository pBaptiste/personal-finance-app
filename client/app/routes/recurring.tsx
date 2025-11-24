import type { Route } from "./+types/recurring";

export function Meta({}: Route.MetaArgs) {
    return [
        {
            title: "Recurring Bills - Personal Finance App"
        },
        {
            name: "description",
            content: "View and Manage your recurring bills"
        }
    ];
}

export default function Recurring() {
    return (
        <div>
            <h1>Recurring bills</h1>
        </div>
    )
}