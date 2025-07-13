import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronDown, ChevronUp, AlertTriangle, CheckIcon } from 'lucide-react';
import { PublicRecordRow } from './public-record-row';

interface PublicRecordsSectionProps {
  publicRecords: any[];
  hasPublicRecords: boolean;
  savedDisputes: {
    [key: string]: boolean | { reason: string; instruction: string; violations?: string[] };
  };
  handleDisputeSaved: (disputeData: any) => void;
  handleDisputeReset: (disputeType: string) => void;
  expandAll: boolean;
  aiViolations?: { [recordId: string]: string[] };
  aiSuggestions?: { [recordId: string]: string[] };
  aiScanCompleted?: boolean;
}

export function PublicRecordsSection({
  publicRecords,
  hasPublicRecords,
  savedDisputes,
  handleDisputeSaved,
  handleDisputeReset,
  expandAll,
  aiViolations = {},
  aiSuggestions = {},
  aiScanCompleted = false,
}: PublicRecordsSectionProps) {
  const [publicRecordsCollapsed, setPublicRecordsCollapsed] = useState(true);
  const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);

  // Calculate saved count
  const savedCount = useMemo(() => {
    return publicRecords.filter((record: any, index: number) => {
      const recordId =
        record['@CreditLiabilityID'] || record['@_SubscriberCode'] || `record_${record.index || index}`;
      return savedDisputes[recordId];
    }).length;
  }, [publicRecords, savedDisputes]);

  const totalRecords = publicRecords.length;
  const allPublicRecordsSaved = savedCount === totalRecords && totalRecords > 0;

  // Auto-collapse when all public records are saved - delay to allow individual cards to collapse first
  useEffect(() => {
    if (allPublicRecordsSaved && !hasAutoCollapsed) {
      const timer = setTimeout(() => {
        setPublicRecordsCollapsed(true);
        setHasAutoCollapsed(true);
      }, 1500); // Increased delay to allow individual record cards to collapse first
      return () => clearTimeout(timer);
    }
  }, [allPublicRecordsSaved, hasAutoCollapsed]);

  // Check for unsaved public records - persistent across expand/collapse actions
  const hasUnsavedPublicRecords = useMemo(() => {
    const hasUnsaved = publicRecords.some((record: any, index: number) => {
      const recordId =
        record['@CreditLiabilityID'] || record['@_SubscriberCode'] || `record_${record.index || index}`;
      return !savedDisputes[recordId];
    });

    return hasUnsaved;
  }, [publicRecords, savedDisputes]);

  const getUnsavedPublicRecordsMessage = () => {
    const unsavedCount = publicRecords.filter((record: any, index: number) => {
      const recordId =
        record['@CreditLiabilityID'] || record['@_SubscriberCode'] || `record_${record.index || index}`;
      return !savedDisputes[recordId];
    }).length;

    if (unsavedCount > 0) {
      return `${unsavedCount} public record${unsavedCount > 1 ? 's' : ''} need dispute review`;
    }
    return '';
  };

  if (!hasPublicRecords) {
    return null;
  }

  // Calculate unsaved count for collapsed state
  const unsavedPublicRecordCount = useMemo(() => {
    return publicRecords.filter((record: any, index: number) => {
      const recordId =
        record['@CreditLiabilityID'] || record['@_SubscriberCode'] || `record_${record.index || index}`;
      return !savedDisputes[recordId];
    }).length;
  }, [publicRecords, savedDisputes]);

  const showIndicator = publicRecordsCollapsed && unsavedPublicRecordCount > 0;

  // Compute summary text for saved disputes
  const totalSavedDisputes = publicRecords.filter((record: any, index: number) => {
    const recordId =
      record['@CreditLiabilityID'] || record['@_SubscriberCode'] || `record_${record.index || index}`;
    return savedDisputes[recordId];
  }).length;
  const summaryText = `You've saved disputes for ${totalSavedDisputes} public record(s) across TransUnion, Equifax, and Experian.`;

  // Handle toggle for both states
  const handleToggle = () => {
    setPublicRecordsCollapsed(!publicRecordsCollapsed);
    // Reset auto-collapse flag when manually toggling to allow future auto-collapse
    setHasAutoCollapsed(false);
  };

  return (
    <div className="mb-4">
      {publicRecordsCollapsed ? (
        <Card
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg rounded-lg shadow-lg overflow-hidden ${
            allPublicRecordsSaved
              ? 'bg-green-50 border-2 border-green-500'
              : 'border-2 border-red-500 bg-rose-50'
          }`}
          onClick={handleToggle}
        >
          <CardHeader
            className={
              allPublicRecordsSaved
                ? 'cursor-pointer flex flex-row items-center p-6 bg-green-50 hover:bg-green-100 transition-colors duration-200'
                : 'cursor-pointer flex flex-row items-center p-6 bg-rose-50 hover:bg-red-100 transition-colors duration-200'
            }
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center ${
                    allPublicRecordsSaved ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {allPublicRecordsSaved ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    publicRecords.length
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h3
                    className={`text-lg font-bold ${
                      allPublicRecordsSaved ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {allPublicRecordsSaved
                      ? 'Public Records – Disputes Saved'
                      : 'Public Records'}
                  </h3>
                  <p
                    className={`text-sm flex items-center gap-1 ${
                      allPublicRecordsSaved ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {allPublicRecordsSaved ? (
                      <span>{summaryText}</span>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        {publicRecords.length} public records need dispute review
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm ${allPublicRecordsSaved ? 'text-green-700' : 'text-red-700'}`}
                >
                  {publicRecords.length} records
                </span>
                <ChevronDown
                  className={`h-5 w-5 ${allPublicRecordsSaved ? 'text-green-700' : 'text-red-700'}`}
                />
              </div>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <Card
          className={`${
            allPublicRecordsSaved
              ? 'bg-green-50 border-2 border-green-500'
              : 'border-2 border-gray-300 bg-white'
          } rounded-lg shadow-lg transition-all duration-300 hover:shadow-lg overflow-hidden`}
        >
          <CardHeader
            onClick={handleToggle}
            className="flex flex-row items-center justify-between p-6 min-h-[92px] cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center ${allPublicRecordsSaved ? 'bg-green-500' : 'bg-red-500'}`}
              >
                {allPublicRecordsSaved ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  publicRecords.length
                )}
              </div>
              <div>
                <h3
                  className={`text-lg font-bold m-0 ${allPublicRecordsSaved ? 'text-green-700' : 'text-red-700'}`}
                >
                  {allPublicRecordsSaved
                    ? 'Public Records – Disputes Saved'
                    : 'Public Records'}
                </h3>
                <p
                  className={`flex flex-row items-center gap-2 text-sm m-0 ${allPublicRecordsSaved ? 'text-green-600' : 'text-red-600'}`}
                >
                  {allPublicRecordsSaved ? (
                    <span>{summaryText}</span>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" /> {publicRecords.length} public
                      records need dispute review
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span
                className={`text-sm ${allPublicRecordsSaved ? 'text-green-600' : 'text-red-600'}`}
              >
                {publicRecords.length} records
              </span>
              <ChevronUp
                className={`h-5 w-5 ${allPublicRecordsSaved ? 'text-green-600' : 'text-red-600'}`}
              />
            </div>
          </CardHeader>
          {!publicRecordsCollapsed && (
            <CardContent
              className={`px-6 pt-2 pb-6 ${allPublicRecordsSaved ? 'bg-green-50' : 'bg-white'}`}
            >
              <div className="space-y-6">
                <div className="flex flex-col gap-6">
                  {publicRecords.map((record: any, index: number) => {
                    const recordId =
                      record['@CreditLiabilityID'] ||
                      record['@_SubscriberCode'] ||
                      `record_${record.index || index}`;
                    return (
                      <PublicRecordRow
                        key={`public-record-${recordId}`}
                        record={record}
                        recordIndex={index}
                        onDispute={() => {}}
                        onDisputeSaved={handleDisputeSaved}
                        onDisputeReset={handleDisputeReset}
                        onHeaderReset={() => {}}
                        expandAll={expandAll}
                        aiViolations={aiViolations[recordId] || []}
                        aiSuggestions={aiSuggestions[recordId] || []}
                        aiScanCompleted={aiScanCompleted}
                        savedDisputes={savedDisputes}
                      />
                    );
                  })}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
