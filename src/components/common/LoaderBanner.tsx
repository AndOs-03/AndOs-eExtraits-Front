interface LoaderBannerProps {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}

export default function LoaderBanner({ status, message }: LoaderBannerProps) {
  if (status === "idle") return (<p></p>);

  let bgColor = "bg-gray-200 text-gray-800";
  if (status === "loading") bgColor = "bg-blue-100 text-blue-600";
  if (status === "success") bgColor = "bg-green-100 text-green-600";
  if (status === "error") bgColor = "bg-red-100 text-red-600";

  return (
      <div className={`${bgColor} text-center py-2 font-medium`}>
        {message}
      </div>
  );
}
