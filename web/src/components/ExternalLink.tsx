import type { MouseEvent, ReactNode } from "react";
import { isIosLike } from "../utils/ios";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
};

/**
 * Sur iOS/iPadOS, Safari ouvre parfois les liens dans l’onglet courant malgré target="_blank".
 * Un window.open() synchrone au clic contourne le cas le plus fréquent.
 */
export function ExternalLink({ href, className, children }: Props) {
  const ios = isIosLike();

  const onClick = ios
    ? (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.open(href, "_blank", "noopener,noreferrer");
      }
    : undefined;

  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      {children}
    </a>
  );
}
