import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export interface CollapsedCreditCardProps {
  /** Total number of credit accounts */
  totalCount: number;
  /** Number of negative / unsaved accounts */
  warningCount: number;
  /** Whether the section is open */
  isOpen: boolean;
  /** Handler for toggling */
  onToggle: () => void;
  /** Children shown in expanded state */
  children?: React.ReactNode;
}

const CollapsedCreditCard: React.FC<CollapsedCreditCardProps> = ({
  totalCount,
  warningCount,
  isOpen,
  onToggle,
  children,
}) => {
  const hasWarning = warningCount > 0;

  const subtitle = hasWarning
    ? `${warningCount} negative accounts need dispute review`
    : `${totalCount} credit accounts in good standing`;

  const cardClasses = cn(
    "transition-all duration-300",
    // Red styling when collapsed AND has warnings
    !isOpen && hasWarning
      ? "border-2 border-red-500 bg-red-50 hover:shadow-lg cursor-pointer rounded-lg overflow-hidden"
      : // Expanded state gets no styling (applied by wrapper), collapsed state gets border
        isOpen
      ? ""
      : "border border-gray-200 bg-white hover:shadow-lg cursor-pointer rounded-lg overflow-hidden"
  );

  return (
    <Card className={cardClasses} data-testid="credit-accounts-card" data-is-open={isOpen}>
      {/* HEADER (always visible) */}
      <CardHeader
        className={cn(
          "cursor-pointer transition-colors duration-200 min-h-[72px] flex items-center",
          !isOpen && hasWarning ? "hover:bg-red-100" : "hover:bg-gray-50"
        )}
        onClick={onToggle}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
              !isOpen && hasWarning ? "bg-red-500" : "bg-slate-600"
            )}>
              {totalCount}
            </div>
            <div className="flex flex-col justify-center">
              <h3 className={cn(
                "text-lg font-bold",
                !isOpen && hasWarning ? "text-red-700" : "text-gray-700"
              )}>
                Credit Accounts
              </h3>
              <p className={cn(
                "text-sm flex items-center gap-1",
                !isOpen && hasWarning ? "text-red-700" : "text-gray-600"
              )}>
                {!isOpen && hasWarning && <AlertTriangle className="w-4 h-4" />}
                {subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-sm",
              !isOpen && hasWarning ? "text-red-600" : "text-gray-600"
            )}>
              {totalCount} {totalCount === 1 ? "account" : "accounts"}
            </span>
            {isOpen ? (
              <ChevronUp className={cn(
                !isOpen && hasWarning ? "text-red-600" : "text-gray-600"
              )} />
            ) : (
              <ChevronDown className={cn(
                !isOpen && hasWarning ? "text-red-600" : "text-gray-600"
              )} />
            )}
          </div>
        </div>
      </CardHeader>

      {/* BODY (only when open) */}
      {isOpen && children && (
        <CardContent className="pt-0 pb-4 px-4">{children}</CardContent>
      )}
    </Card>
  );
};

export default CollapsedCreditCard;