import type { Route } from "./+types/pots";

export function Meta({}: Route.MetaArgs) {
    return [
        {
            title: "Pots - Personal Finance App"
        },
        {
            name: "description",
            content: "View and manage your pots"
        }
    ];
}

export default function Pots() {
    return (
        <div>
            <h1>Pots</h1>
        </div>
    )
}