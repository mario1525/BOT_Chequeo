"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.innerHTML = `window.$zoho=window.$zoho || {}; $zoho.salesiq=$zoho.salesiq||{ready:function(){}}`;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src =
      "https://salesiq.zohopublic.com/widget?wc=siq1b223a368a90eddef5e58636e729637f93f8d110f63a867871603095ebe2e15c";
    script2.defer = true;
    document.body.appendChild(script2);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="text-center p-6 border-2 border-[var(--color-foreground)] rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold">SGS Colombia</h1>
        <p className="mt-4 text-lg">Estado de los chequeos.</p>
      </div>
    </div>
  );
}
