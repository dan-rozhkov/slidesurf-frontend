
import { useScopedI18n } from "@/lib/locales/client";
import type { ThemeFormData } from "./types";

const baseSlideStyle = {
  width: "60em",
  height: "33.75em",
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
} as const;

export function ThemePreview({ themeData }: { themeData: ThemeFormData }) {
  const previewStyle = {
    backgroundColor: themeData.backgroundColor,
    color: themeData.foregroundColor,
    fontFamily: `"${themeData.fontFamily}", sans-serif`,
  } as const;

  const cardStyle = {
    backgroundColor: themeData.cardBackgroundColor,
    color: themeData.cardForegroundColor,
    border: `0.05em solid ${themeData.cardBorderColor}`,
  } as const;

  return (
    <div
      className="flex flex-col gap-12 py-12 items-center"
      style={{ fontSize: "12px" }}
    >
      <SlidesPreview
        themeData={themeData}
        previewStyle={previewStyle}
        cardStyle={cardStyle}
      />
    </div>
  );
}

function SlidesPreview({
  themeData,
  previewStyle,
  cardStyle,
}: {
  themeData: ThemeFormData;
  previewStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
}) {
  const t = useScopedI18n("themes.editor");

  return (
    <>
      <div
        className="slide rounded-lg overflow-hidden border border-border flex shadow-sm"
        style={{ ...baseSlideStyle, ...previewStyle }}
      >
        <FirstCard cardStyle={cardStyle} themeData={themeData} t={t} />
      </div>

      <div
        className="slide rounded-lg overflow-hidden border border-border flex shadow-sm"
        style={{ ...baseSlideStyle, ...previewStyle }}
      >
        <SecondCard themeData={themeData} t={t} />
      </div>
    </>
  );
}

function FirstCard({
  cardStyle,
  themeData,
  t,
}: {
  cardStyle: React.CSSProperties;
  themeData: ThemeFormData;
  t: ReturnType<typeof useScopedI18n>;
}) {
  return (
    <>
      <div className="gap-[0.5em] flex flex-col justify-center p-[4em]">
        <h1
          style={{
            fontFamily: `"${
              themeData.fontFamilyHeader || themeData.fontFamily
            }", sans-serif`,
            color: themeData.foregroundColor,
          }}
        >
          {t("preview")}
        </h1>

        <p>{t("previewDescription")}</p>

        <div className="flex gap-[2em]">
          <div data-type="card" style={{ ...cardStyle }}>
            <p>
              <span style={{ fontSize: "3em" }}>
                <strong>1</strong>
              </span>
            </p>
            <p>{t("cardText")}</p>
          </div>

          <div data-type="card" style={{ ...cardStyle }}>
            <p>
              <span style={{ fontSize: "3em" }}>
                <strong>2</strong>
              </span>
            </p>
            <p>{t("cardText")}</p>
          </div>
        </div>
      </div>

      <div
        className="w-[35%] h-full shrink-0"
        style={{ backgroundColor: cardStyle.backgroundColor }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-[2em]"
            style={{ color: themeData.foregroundColor, opacity: 0.1 }}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8.813 11.612c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.986 4.986l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l.292 -.293l.106 -.095c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.674 4.675a4 4 0 0 1 -3.775 3.599l-.206 .005h-12a4 4 0 0 1 -3.98 -3.603l6.687 -6.69l.106 -.095zm9.187 -9.612a4 4 0 0 1 3.995 3.8l.005 .2v9.585l-3.293 -3.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-.307 .306l-2.293 -2.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-5.307 5.306v-9.585a4 4 0 0 1 3.8 -3.995l.2 -.005h12zm-2.99 5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
          </svg>
        </div>
      </div>
    </>
  );
}

function SecondCard({
  themeData,
  t,
}: {
  themeData: ThemeFormData;
  t: ReturnType<typeof useScopedI18n>;
}) {
  return (
    <>
      <div className="gap-[0.5em] flex flex-col justify-center p-[4em]">
        <h1
          style={{
            fontFamily: `"${
              themeData.fontFamilyHeader || themeData.fontFamily
            }", sans-serif`,
            color: themeData.foregroundColor,
          }}
        >
          {t("smartCards")}
        </h1>

        <p>{t("smartCardsDescription")}</p>

        <div
          data-type="smart-layout"
          data-smart-layout-type="arrows"
          className="flex pt-[2em]"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-center flex-grow h-[3em] mb-[0.5em] arrow-bg font-semibold"
              style={{
                color: themeData.cardForegroundColor,
                background: themeData[
                  `smartLayoutItem${index + 1}` as keyof ThemeFormData
                ] as string,
                border: `1px solid ${themeData["smartLayoutBorderColor"]}`,
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4">
          <p className="px-1">{t("stepText")}</p>
          <p className="px-1">{t("stepText")}</p>
          <p className="px-1">{t("stepText")}</p>
          <p className="px-1">{t("stepText")}</p>
        </div>
      </div>
    </>
  );
}
