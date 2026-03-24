import dedent from "dedent";
import { Slide, SlideVerticalAlign, SlideLayout } from "@/types";

type SlideTemplate = Partial<Slide> & { name: string; description: string };

export const empty: SlideTemplate = {
  name: "empty",
  description: "Пустой слайд",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent``,
};

export const twoColsWithSubheadings: SlideTemplate = {
  name: "twoColsWithSubheadings",
  description: "Слайд с двумя колонками и подзаголовками",
  layout: SlideLayout.LEFT_IMAGE,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <div data-type="columns">
      <div data-type="column">
        <h2>Подзаголовок</h2>
        <p>Текст</p>
      </div>
      <div data-type="column">
        <h2>Подзаголовок</h2>
        <p>Текст</p>
      </div>
    </div>
  `,
};

export const twoCols: SlideTemplate = {
  name: "twoCols",
  description: "Слайд с двумя колонками",
  layout: SlideLayout.RIGHT_IMAGE,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <div data-type="columns">
      <div data-type="column">
        <p>Текст</p>
      </div>
      <div data-type="column">
        <p>Текст</p>
      </div>
    </div>
  `,
};

export const twoColsWithBarChart: SlideTemplate = {
  name: "twoColsWithBarChart",
  description: "Слайд с текстом слева и столбчатым графиком справа",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <div data-type="columns">
      <div data-type="column">
        <h2>Подзаголовок</h2>
        <p>Краткое описание</p>
      </div>
      <div data-type="column">
        <div data-type="chart" data-chart-type="bar" data-show-labels="true" data-data='[[{"value":"Категория"},{"value":"Значение"}],[{"value":"A"},{"value":"45"}],[{"value":"B"},{"value":"60"}],[{"value":"C"},{"value":"40"}],[{"value":"D"},{"value":"25"}]]'>Chart Data</div>
      </div>
    </div>
  `,
};

export const threeCols: SlideTemplate = {
  name: "threeCols",
  description: "Слайд с тремя колонками",
  layout: SlideLayout.TOP_IMAGE,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <div data-type="columns">
      <div data-type="column">
        <p>Текст</p>
      </div>
      <div data-type="column">
        <p>Текст</p>
      </div>
      <div data-type="column">
        <p>Текст</p>
      </div>
    </div>
  `,
};

export const fourCols: SlideTemplate = {
  name: "fourCols",
  description: "Слайд с четырьмя колонками",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <div data-type="columns">
      <div data-type="column">
        <p>Текст</p>
      </div>
      <div data-type="column">
        <p>Текст</p>
      </div>
      <div data-type="column">
        <p>Текст</p>
      </div>
      <div data-type="column">
        <p>Текст</p>
      </div>
    </div>
  `,
};

export const cards: SlideTemplate = {
  name: "cards",
  description: "Слайд с карточками",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h4 style="text-transform: uppercase; letter-spacing: 0.1em">Преимущества</h4>
    <h1>Заголовок</h1>
    <div data-type="columns">
      <div data-type="column">
        <div data-type="card">
          <p>
            <span data-type="icon" data-icon-name="rocket" data-icon-size="xl"></span>
          </p>
          <p></p>
          <h3>Подзаголовок</h3>
          <p>Описание преимущества с конкретными данными и фактами в 1-2 предложения</p>
        </div>
      </div>
      <div data-type="column">
        <div data-type="card">
          <p>
            <span data-type="icon" data-icon-name="target" data-icon-size="xl"></span>
          </p>
          <p></p>
          <h3>Подзаголовок</h3>
          <p>Описание преимущества с конкретными данными и фактами в 1-2 предложения</p>
        </div>
      </div>
      <div data-type="column">
        <div data-type="card">
          <p>
            <span data-type="icon" data-icon-name="trophy" data-icon-size="xl"></span>
          </p>
          <p></p>
          <h3>Подзаголовок</h3>
          <p>Описание преимущества с конкретными данными и фактами в 1-2 предложения</p>
        </div>
      </div>
    </div>
  `,
};

export const frontSlide: SlideTemplate = {
  name: "frontSlide",
  description: "Титульный слайд",
  layout: SlideLayout.RIGHT_IMAGE,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1 style="text-align: left;">Заголовок</h1>
    <p style="text-align: left;">Текст</p>
    <p style="text-align: left;">${new Date().toLocaleDateString("ru-RU")}</p>
  `,
};

export const imageWithText: SlideTemplate = {
  name: "imageWithText",
  description: "Слайд с изображением слева и текстом справа",
  layout: SlideLayout.LEFT_IMAGE,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <p>Текст</p>
  `,
};

export const textWithImage: SlideTemplate = {
  name: "textWithImage",
  description: "Слайд с текстом слева и изображением справа",
  layout: SlideLayout.RIGHT_IMAGE,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <p>Текст</p>
  `,
};

export const titleWithListOptionsAndImage: SlideTemplate = {
  name: "titleWithListOptionsAndImage",
  description: "Слайд с заголовком, списком опций и изображением справа",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <div data-type="columns">
      <div data-type="column">
        <ul>
          <li>Текст</li>
          <li>Текст</li>
          <li>Текст</li>
        </ul>
      </div>
      <div data-type="column">
        <img src="/placeholders/image-placeholder.png" alt="Изображение" />
      </div>
    </div>
  `,
};

export const titleWithListOptions: SlideTemplate = {
  name: "titleWithListOptions",
  description: "Слайд с заголовком и списком опций",
  layout: SlideLayout.RIGHT_IMAGE,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <ul>
      <li>Текст</li>
      <li>Текст</li>
      <li>Текст</li>
    </ul>
  `,
};

export const titleWithTable: SlideTemplate = {
  name: "titleWithTable",
  description: "Слайд с заголовком, описанием и таблицей",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <p>Краткое описание</p>
    <table>
      <tr>
        <th>Характеристика</th>
        <th>Вариант A</th>
        <th>Вариант B</th>
      </tr>
      <tr>
        <td>Параметр 1</td>
        <td>Значение</td>
        <td>Значение</td>
      </tr>
      <tr>
        <td>Параметр 2</td>
        <td>Значение</td>
        <td>Значение</td>
      </tr>
    </table>
  `,
};

export const titleWithFeaturesList: SlideTemplate = {
  name: "titleWithFeaturesList",
  description: "Слайд с заголовком, списком особенностей и изображением справа",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <p>Описание слайда</p>
    <div data-type="features-list">
      <div data-type="feature" data-title="Заголовок" data-content="Текст"></div>
      <div data-type="feature" data-title="Заголовок" data-content="Текст"></div>
      <div data-type="feature" data-title="Заголовок" data-content="Текст"></div>
      <div data-type="feature" data-title="Заголовок" data-content="Текст"></div>
      <div data-type="feature" data-title="Заголовок" data-content="Текст"></div>
      <div data-type="feature" data-title="Заголовок" data-content="Текст"></div>
    </div>
  `,
};

export const threeColsWithIcons: SlideTemplate = {
  name: "threeColsWithIcons",
  description: "Слайд с тремя колонками и иконками",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1 style="text-align: center">Заголовок</h1>
    <p style="text-align: center">Подзаголовок</p>
    <div data-type="columns">
      <div data-type="column">
        <p style="text-align: center"><span data-type="icon" data-icon-name="lightbulb" data-icon-size="xl"></span></p>
        <p></p>
        <h3 style="text-align: center">Заголовок</h3>
        <p style="text-align: center">Текст</p>
      </div>
      <div data-type="column">
        <p style="text-align: center"><span data-type="icon" data-icon-name="shield" data-icon-size="xl"></span></p>
        <p></p>
        <h3 style="text-align: center">Заголовок</h3>
        <p style="text-align: center">Текст</p>
      </div>
      <div data-type="column">
        <p style="text-align: center"><span data-type="icon" data-icon-name="zap" data-icon-size="xl"></span></p>
        <p></p>
        <h3 style="text-align: center">Заголовок</h3>
        <p style="text-align: center">Текст</p>
      </div>
    </div>
  `,
};

export const titleWithTimeline: SlideTemplate = {
  name: "titleWithTimeline",
  description: "Слайд с заголовком, списком событий и временной шкалой",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1>Заголовок</h1>
    <p>Описание слайда</p>
    <div data-type="timeline" data-direction="horizontal">
      <div data-type="timeline-item" data-title="Заголовок" data-content="Текст"></div>
      <div data-type="timeline-item" data-title="Заголовок" data-content="Текст"></div>
      <div data-type="timeline-item" data-title="Заголовок" data-content="Текст"></div>
    </div>
  `,
};

export const arrowsHorizontal: SlideTemplate = {
  name: "arrowsHorizontal",
  description: "Слайд со стрелками",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1 style="text-align: center">Заголовок</h1>
    <p style="text-align: center">Подзаголовок</p>
    <p style="text-align: center"></p>
    <div data-smart-layout-type="arrows" data-type="smart-layout">
      <div data-smart-layout-type="arrows" data-smart-layout-value="" data-type="smart-layout-item">
        <p style="text-align: left"></p>
        <h3>Подзаголовок</h3>
        <p style="text-align: left">Текст</p>
      </div>
      <div data-smart-layout-type="arrows" data-smart-layout-value="" data-type="smart-layout-item">
        <p style="text-align: "></p>
        <h3>Подзаголовок</h3>
        <p style="text-align: left">Текст</p>
      </div>
      <div data-smart-layout-type="arrows" data-smart-layout-value="" data-type="smart-layout-item">
        <p style="text-align: left"></p>
        <h3 style="text-align: left">Подзаголовок</h3>
        <p style="text-align: left">Текст</p>
      </div>
      <div data-smart-layout-type="arrows" data-smart-layout-value="" data-type="smart-layout-item">
        <p style="text-align: left"></p>
        <h3 style="text-align: left">Подзаголовок</h3>
        <p style="text-align: left">Текст</p>
      </div>
    </div>
  `,
};

export const pyramid: SlideTemplate = {
  name: "pyramid",
  description: "Слайд с пирамидой",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <div data-type="columns">
      <div data-type="column">
        <h1>Заголовок</h1>
        <p style="text-align: left">Текст</p>
      </div>
      <div data-type="column">
        <div data-smart-layout-type="pyramid" data-type="smart-layout">
          <div data-smart-layout-type="pyramid" data-smart-layout-value="" data-type="smart-layout-item">
            <p style="text-align: left">Текст</p>
          </div>
          <div data-smart-layout-type="pyramid" data-smart-layout-value="" data-type="smart-layout-item">
            <p style="text-align: left">Текст</p>
          </div>
          <div data-smart-layout-type="pyramid" data-smart-layout-value="" data-type="smart-layout-item">
            <p style="text-align: left">Текст</p>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const statistics: SlideTemplate = {
  name: "statistics",
  description: "Слайд со статистикой",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1 style="text-align: center"><strong>Заголовок</strong></h1>
    <p style="text-align: center">Подзаголовок слайда</p>
    <p style="text-align: center"></p>
    <div data-smart-layout-type="statistics" data-type="smart-layout">
      <div data-smart-layout-type="statistics" data-smart-layout-value="" data-type="smart-layout-item">
        <h4 style="text-align: center">Заголовок 1</h4>
        <p style="text-align: center">Описание 1</p>
      </div>
      <div data-smart-layout-type="statistics" data-smart-layout-value="25" data-type="smart-layout-item">
        <h4 style="text-align: center">Заголовок 2</h4>
        <p style="text-align: center">Описание 2</p>
      </div>
      <div data-smart-layout-type="statistics" data-smart-layout-value="" data-type="smart-layout-item">
        <h4 style="text-align: center">Заголовок 3</h4>
        <p style="text-align: center">Описание 3</p>
      </div>
    </div>
  `,
};

export const bigNumbers: SlideTemplate = {
  name: "bigNumbers",
  description: "Слайд с большими числами",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1 style="text-align: center"><strong>Заголовок</strong></h1>
    <p style="text-align: center">Подзаголовок слайда</p>
    <p style="text-align: center"></p>
    <div data-smart-layout-type="big-numbers" data-type="smart-layout">
      <div data-smart-layout-type="big-numbers" data-smart-layout-value="100" data-type="smart-layout-item">
        <h4 style="text-align: center">Заголовок 1</h4>
        <p style="text-align: center">Описание 1</p>
      </div>
      <div data-smart-layout-type="big-numbers" data-smart-layout-value="75" data-type="smart-layout-item">
        <h4 style="text-align: center">Заголовок 2</h4>
        <p style="text-align: center">Описание 2</p>
      </div>
      <div data-smart-layout-type="big-numbers" data-smart-layout-value="50" data-type="smart-layout-item">
        <h4 style="text-align: center">Заголовок 3</h4>
        <p style="text-align: center">Описание 3</p>
      </div>
    </div>
  `,
};

export const ratingStars: SlideTemplate = {
  name: "ratingStars",
  description: "Слайд с рейтингом звездами",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1 style="text-align: center"><strong>Заголовок</strong></h1>
    <p style="text-align: center">Подзаголовок слайда</p>
    <p style="text-align: center"></p>
    <div data-smart-layout-type="raiting-stars" data-type="smart-layout">
      <div data-smart-layout-type="raiting-stars" data-smart-layout-value="5" data-type="smart-layout-item">
        <h4 style="text-align: center">Заголовок 1</h4>
        <p style="text-align: center">Описание 1</p>
      </div>
      <div data-smart-layout-type="raiting-stars" data-smart-layout-value="4" data-type="smart-layout-item">
        <h4 style="text-align: center">Заголовок 2</h4>
        <p style="text-align: center">Описание 2</p>
      </div>
      <div data-smart-layout-type="raiting-stars" data-smart-layout-value="3" data-type="smart-layout-item">
        <h4 style="text-align: center">Заголовок 3</h4>
        <p style="text-align: center">Описание 3</p>
      </div>
    </div>
  `,
};

export const quotes: SlideTemplate = {
  name: "quotes",
  description: "Слайд с цитатами",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1 style="text-align: center"><strong>Заголовок</strong></h1>
    <p style="text-align: center">Подзаголовок слайда</p>
    <p style="text-align: center"></p>
    <div data-smart-layout-type="quotes" data-type="smart-layout">
      <div data-smart-layout-type="quotes" data-smart-layout-value="" data-type="smart-layout-item">
        <p style="text-align: center">Цитата 1</p>
        <p style="text-align: center">Автор 1</p>
      </div>
      <div data-smart-layout-type="quotes" data-smart-layout-value="" data-type="smart-layout-item">
        <p style="text-align: center">Цитата 2</p>
        <p style="text-align: center">Автор 2</p>
      </div>
      <div data-smart-layout-type="quotes" data-smart-layout-value="" data-type="smart-layout-item">
        <p style="text-align: center">Цитата 3</p>
        <p style="text-align: center">Автор 3</p>
      </div>
    </div>
  `,
};

export const bentoGrid: SlideTemplate = {
  name: "bentoGrid",
  description: "Слайд с bento-сеткой и ключевыми показателями",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h1 style="text-align: center"><strong>Заголовок</strong></h1>
    <p style="text-align: center">Подзаголовок слайда</p>
    <div data-type="bento-grid" data-cols="3" data-rows="4">
      <div data-type="bento-grid-item" data-col-span="1" data-row-span="2" data-col-start="1" data-row-start="1">
        <h2>150+</h2>
        <p>Довольных клиентов</p>
      </div>
      <div data-type="bento-grid-item" data-col-span="1" data-row-span="2" data-col-start="2" data-row-start="1">
        <h2>98%</h2>
        <p>Уровень удовлетворённости</p>
      </div>
      <div data-type="bento-grid-item" data-col-span="1" data-row-span="2" data-col-start="3" data-row-start="1">
        <h2>24/7</h2>
        <p>Техническая поддержка</p>
      </div>
      <div data-type="bento-grid-item" data-col-span="1" data-row-span="2" data-col-start="1" data-row-start="3">
        <h2>5+</h2>
        <p>Лет опыта</p>
      </div>
      <div data-type="bento-grid-item" data-col-span="1" data-row-span="1" data-col-start="2" data-row-start="3">
        <h2>50K</h2>
        <p>Активных пользователей</p>
      </div>
      <div data-type="bento-grid-item" data-col-span="1" data-row-span="2" data-col-start="3" data-row-start="3">
        <h2>12</h2>
        <p>Стран присутствия</p>
      </div>
      <div data-type="bento-grid-item" data-col-span="1" data-row-span="1" data-col-start="2" data-row-start="4">
        <h2>3x</h2>
        <p>Рост прибыли</p>
      </div>
    </div>
  `,
};

export const tocSlide: SlideTemplate = {
  name: "tocSlide",
  description: "Слайд с содержанием презентации и нумерованными разделами",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h4 style="text-transform: uppercase; letter-spacing: 0.1em">Структура презентации</h4>
    <h1>Содержание</h1>
    <div data-type="columns">
      <div data-type="column">
        <div data-type="card">
          <h1>01</h1>
          <h3>Обзор рынка и текущие тенденции</h3>
          <p>Анализ ключевых показателей, динамики роста и основных трендов за последние годы</p>
        </div>
      </div>
      <div data-type="column">
        <div data-type="card">
          <h1>02</h1>
          <h3>Конкурентный ландшафт и позиционирование</h3>
          <p>Сравнительный анализ ключевых игроков, их стратегий и рыночных долей</p>
        </div>
      </div>
      <div data-type="column">
        <div data-type="card">
          <h1>03</h1>
          <h3>Стратегия развития и рекомендации</h3>
          <p>Инвестиционные возможности, прогнозы роста и практические рекомендации</p>
        </div>
      </div>
    </div>
  `,
};

export const chapterDivider: SlideTemplate = {
  name: "chapterDivider",
  description: "Слайд-разделитель главы с заголовком и KPI-метриками",
  layout: SlideLayout.TOP_IMAGE,
  verticalAlign: SlideVerticalAlign.BOTTOM,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h4 style="text-transform: uppercase; letter-spacing: 0.1em">Глава 01</h4>
    <h1>Обзор рынка и ключевые показатели</h1>
    <p>Масштаб рынка, динамика роста и позиционирование среди глобальных конкурентов</p>
    <p></p>
    <div data-smart-layout-type="big-numbers" data-type="smart-layout">
      <div data-smart-layout-type="big-numbers" data-smart-layout-value="#2" data-type="smart-layout-item">
        <h4>Позиция в мире</h4>
        <p>По объёму потребления</p>
      </div>
      <div data-smart-layout-type="big-numbers" data-smart-layout-value="16.7%" data-type="smart-layout-item">
        <h4>Доля рынка</h4>
        <p>Мирового спроса</p>
      </div>
      <div data-smart-layout-type="big-numbers" data-smart-layout-value="$153B" data-type="smart-layout-item">
        <h4>Прогноз к 2033</h4>
        <p>Объём рынка</p>
      </div>
    </div>
  `,
};

export const dataWithChart: SlideTemplate = {
  name: "dataWithChart",
  description: "Аналитический слайд с текстовыми блоками слева и графиком справа",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h4 style="text-transform: uppercase; letter-spacing: 0.1em">Анализ данных</h4>
    <h1>Динамика и структура рынка</h1>
    <div data-type="columns">
      <div data-type="column">
        <div data-smart-layout-type="arrows-down" data-type="smart-layout">
          <div data-smart-layout-type="arrows-down" data-smart-layout-value="" data-type="smart-layout-item">
            <h3>Глобальная позиция</h3>
            <p>Второе место в мире по объёму потребления — 802.8 метрических тонн</p>
          </div>
          <div data-smart-layout-type="arrows-down" data-smart-layout-value="" data-type="smart-layout-item">
            <h3>Структура спроса</h3>
            <p>16.1% мирового спроса, общий объём оценивается в $62 млрд</p>
          </div>
          <div data-smart-layout-type="arrows-down" data-smart-layout-value="" data-type="smart-layout-item">
            <h3>Прогноз роста</h3>
            <p>CAGR 6.5%, к 2033 году рынок достигнет $153 млрд</p>
          </div>
        </div>
      </div>
      <div data-type="column">
        <div data-type="chart" data-chart-type="bar" data-show-labels="true" data-data='[[{"value":"Год"},{"value":"Потребление (тонн)"}],[{"value":"2020"},{"value":"446"}],[{"value":"2021"},{"value":"797"}],[{"value":"2022"},{"value":"774"}],[{"value":"2023"},{"value":"761"}],[{"value":"2024"},{"value":"803"}]]'>Chart Data</div>
        <div data-type="card">
          <p><span data-type="icon" data-icon-name="trending-up" data-icon-size="md"></span> <strong>Ключевой тренд:</strong> Потребление выросло на <strong>5.5%</strong> за последний год, достигнув рекордных показателей</p>
        </div>
      </div>
    </div>
  `,
};

export const conclusionSlide: SlideTemplate = {
  name: "conclusionSlide",
  description: "Заключительный слайд с итогами, KPI-метриками и рекомендациями",
  layout: SlideLayout.TOP_IMAGE,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h4 style="text-transform: uppercase; letter-spacing: 0.1em">Заключение</h4>
    <h1>Перспективы и рекомендации</h1>
    <p>Ключевые выводы по результатам анализа и стратегические рекомендации для принятия решений</p>
    <p></p>
    <div data-smart-layout-type="big-numbers" data-type="smart-layout">
      <div data-smart-layout-type="big-numbers" data-smart-layout-value="$153B" data-type="smart-layout-item">
        <h4>Прогноз рынка</h4>
        <p>К 2033 году</p>
      </div>
      <div data-smart-layout-type="big-numbers" data-smart-layout-value="6.5%" data-type="smart-layout-item">
        <h4>CAGR</h4>
        <p>Среднегодовой рост</p>
      </div>
      <div data-smart-layout-type="big-numbers" data-smart-layout-value="Digital" data-type="smart-layout-item">
        <h4>Новые возможности</h4>
        <p>Цифровые платформы</p>
      </div>
    </div>
    <div data-type="card">
      <p><span data-type="icon" data-icon-name="lightbulb" data-icon-size="md"></span> <strong>Рекомендация:</strong> Рассмотреть инвестиции в цифровые платформы и диверсифицировать портфель с учётом прогнозируемого роста рынка</p>
    </div>
  `,
};

export const contentWithInsight: SlideTemplate = {
  name: "contentWithInsight",
  description: "Контентный слайд с текстом и insight-баром внизу",
  layout: SlideLayout.RIGHT_IMAGE,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h4 style="text-transform: uppercase; letter-spacing: 0.1em">Обзор рынка</h4>
    <h1>Ключевые факторы роста</h1>
    <ul>
      <li>Увеличение спроса на <strong>40%</strong> в праздничные сезоны, что создаёт устойчивый цикл потребления</li>
      <li>Рост цифровых платформ позволяет привлечь новую аудиторию и снизить издержки до <strong>0.5-1%</strong></li>
      <li>Снижение импортных пошлин с <strong>15%</strong> до <strong>6%</strong> стимулирует легальный импорт</li>
      <li>Обязательная сертификация качества повышает доверие потребителей к рынку</li>
    </ul>
    <div data-type="card">
      <p><span data-type="icon" data-icon-name="info" data-icon-size="md"></span> <strong>Ключевой вывод:</strong> Совокупность регуляторных послаблений и роста цифровых каналов создаёт благоприятные условия для инвестиций</p>
    </div>
  `,
};

export const kpiCards: SlideTemplate = {
  name: "kpiCards",
  description: "Слайд с KPI-карточками и крупными метриками",
  layout: SlideLayout.WITHOUT,
  verticalAlign: SlideVerticalAlign.CENTER,
  content: dedent.withOptions({
    escapeSpecialCharacters: false,
  })`
    <h4 style="text-transform: uppercase; letter-spacing: 0.1em">Ключевые показатели</h4>
    <h1 style="text-align: center">Результаты за 2024 год</h1>
    <div data-type="columns">
      <div data-type="column">
        <div data-type="card">
          <p style="text-align: center"><span data-type="icon" data-icon-name="trending-up" data-icon-size="xl"></span></p>
          <p></p>
          <h2 style="text-align: center">$153B</h2>
          <p style="text-align: center">Прогнозируемый объём рынка к 2033 году при CAGR 6.5%</p>
        </div>
      </div>
      <div data-type="column">
        <div data-type="card">
          <p style="text-align: center"><span data-type="icon" data-icon-name="users" data-icon-size="xl"></span></p>
          <p></p>
          <h2 style="text-align: center">16.7%</h2>
          <p style="text-align: center">Доля мирового спроса, что составляет более 800 метрических тонн</p>
        </div>
      </div>
      <div data-type="column">
        <div data-type="card">
          <p style="text-align: center"><span data-type="icon" data-icon-name="award" data-icon-size="xl"></span></p>
          <p></p>
          <h2 style="text-align: center">#2</h2>
          <p style="text-align: center">Позиция в мировом рейтинге по объёму потребления</p>
        </div>
      </div>
    </div>
  `,
};

export const SLIDE_TEMPLATES = [
  empty,
  twoColsWithSubheadings,
  twoCols,
  twoColsWithBarChart,
  threeCols,
  fourCols,
  cards,
  frontSlide,
  imageWithText,
  textWithImage,
  titleWithListOptionsAndImage,
  titleWithListOptions,
  titleWithTable,
  titleWithFeaturesList,
  threeColsWithIcons,
  titleWithTimeline,
  arrowsHorizontal,
  pyramid,
  statistics,
  bigNumbers,
  ratingStars,
  quotes,
  bentoGrid,
  tocSlide,
  chapterDivider,
  dataWithChart,
  conclusionSlide,
  contentWithInsight,
  kpiCards,
];

export const SLIDE_TEMPLATES_FOR_GENERATION = [
  twoColsWithSubheadings,
  twoCols,
  twoColsWithBarChart,
  threeCols,
  fourCols,
  cards,
  frontSlide,
  imageWithText,
  textWithImage,
  titleWithListOptionsAndImage,
  titleWithListOptions,
  titleWithTable,
  titleWithFeaturesList,
  threeColsWithIcons,
  titleWithTimeline,
  arrowsHorizontal,
  pyramid,
  statistics,
  bigNumbers,
  bentoGrid,
  tocSlide,
  chapterDivider,
  dataWithChart,
  conclusionSlide,
  contentWithInsight,
  kpiCards,
];
