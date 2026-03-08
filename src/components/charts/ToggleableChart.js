import React from 'react';
import Loader from './../Loader';
import ImageChart from './ImageChart';

const ToggleableChart = ({
  isLoading,
  chartData,
  filters,
  legendItems,
  showFull,
  setShowFull,
  limit = 10
}) => {
  if (!chartData) return null;

  const dataKeys = chartData.data ? Object.keys(chartData.data) : [];
  const showToggle = dataKeys.length > limit;

  return (
    <Loader loading={isLoading}>
      <div>
        <ImageChart
          barData={chartData.data}
          options={chartData.options}
          filters={filters}
          legendItems={legendItems}
          showFull={showFull}
          limit={limit}
        />
        {/* {showToggle && (
          <div
            className="text-small text-faction-show-all"
            onClick={() => setShowFull(!showFull)}
          >
            Show {showFull ? "Less" : "All"}
          </div>
        )} */}
      </div>
    </Loader>
  );
};

export default ToggleableChart;