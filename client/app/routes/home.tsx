import type { Route } from "./+types/home";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personal Finance App" },
    { name: "description", content: "Personal Finance Dashboard" },
  ];
}

export default function Home() {

  return (
    <div className="p-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-preset-1 text-grey-900 mb-4">Welcome to Personal Finance App</h1>
      <p className="text-preset-4 text-grey-500">Your dashboard will appear here.</p>
    </div>
  </div>
   
  );
}
