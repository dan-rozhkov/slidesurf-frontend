
import { StatisticsLayout } from "@/lib/nodes/layouts/statistics-layout";
import { BigNumbersLayout } from "@/lib/nodes/layouts/big-numbers-layout";
import { RatingStarsLayout } from "@/lib/nodes/layouts/rating-stars-layout";
import { ArrowsLayout } from "@/lib/nodes/layouts/arrows-layout";
import { ShapeLayout } from "@/lib/nodes/layouts/shape-layout";
import { ArrowsDownLayout } from "@/lib/nodes/layouts/arrows-down-layout";
import { QuotesLayout } from "@/lib/nodes/layouts/quotes-layout";
import { LayoutFactoryProps } from "@/types";

export const LayoutFactory = ({
  layoutType,
  value,
  index,
  totalItems,
  onClick,
}: LayoutFactoryProps) => {
  switch (layoutType) {
    case "statistics":
      return <StatisticsLayout value={value} onClick={onClick} index={index} />;

    case "big-numbers":
      return <BigNumbersLayout value={value} onClick={onClick} index={index} />;

    case "raiting-stars":
      return (
        <RatingStarsLayout value={value} onClick={onClick} index={index} />
      );

    case "arrows":
      return <ArrowsLayout index={index} />;

    case "pyramid":
      return (
        <ShapeLayout index={index} totalItems={totalItems} variant="pyramid" />
      );

    case "funnel":
      return (
        <ShapeLayout index={index} totalItems={totalItems} variant="funnel" />
      );

    case "arrows-down":
      return <ArrowsDownLayout index={index} />;

    case "quotes":
      return <QuotesLayout />;

    default:
      return null;
  }
};
