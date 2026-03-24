import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Text,
  Image,
  Sparkles,
  Columns,
  SquareEqual,
  Table,
  ChartLine,
  List,
  Calendar,
  Triangle,
  ArrowRight,
  ArrowDown,
  BarChart3,
  Percent,
  Star,
  Filter,
  Quote,
  ChartPie,
  ChartArea,
  ChartColumnBig,
  ChartBarBig,
  GitBranch,
  LayoutGrid,
} from "lucide-react";
import {
  IconChartDonut3,
  IconChartRadar,
  IconRadar2,
} from "@tabler/icons-react";

export const commands = [
  {
    title: "Заголовок 1",
    id: "h1",
    group: "text",
    content: "<h1></h1>",
    icon: Heading1,
  },
  {
    title: "Заголовок 2",
    id: "h2",
    group: "text",
    content: "<h2></h2>",
    icon: Heading2,
  },
  {
    title: "Заголовок 3",
    id: "h3",
    group: "text",
    content: "<h3></h3>",
    icon: Heading3,
  },
  {
    title: "Заголовок 4",
    id: "h4",
    group: "text",
    content: "<h4></h4>",
    icon: Heading4,
  },
  {
    title: "Обычный текст",
    id: "paragraph",
    group: "text",
    content: "<p></p>",
    icon: Text,
  },
  {
    title: "Изображение",
    id: "image",
    group: "image",
    content:
      "<img src='/placeholders/image-placeholder.png' style='width: 25%;' />",
    icon: Image,
  },
  {
    title: "Иконка",
    id: "icon",
    group: "image",
    content: "<span data-type='icon' data-icon-name='star' data-icon-size='xl'></span>",
    icon: Sparkles,
  },
  {
    title: "Карточка",
    id: "card",
    group: "layout",
    content: "<div data-type='card'><p></p></div>",
    icon: SquareEqual,
  },
  {
    title: "Колонки",
    id: "columns",
    group: "layout",
    content:
      "<div data-type='columns'><div data-type='column'><p></p></div><div data-type='column'><p></p></div></div>",
    icon: Columns,
  },
  {
    title: "Бенто-сетка",
    id: "bento-grid",
    group: "layout",
    content:
      "<div data-type='bento-grid' data-cols='3' data-rows='4'><div data-type='bento-grid-item' data-col-span='1' data-row-span='2' data-col-start='1' data-row-start='1'><h2>150+</h2><p>Довольных клиентов</p></div><div data-type='bento-grid-item' data-col-span='1' data-row-span='2' data-col-start='2' data-row-start='1'><h2>98%</h2><p>Уровень удовлетворённости</p></div><div data-type='bento-grid-item' data-col-span='1' data-row-span='2' data-col-start='3' data-row-start='1'><h2>24/7</h2><p>Техническая поддержка</p></div><div data-type='bento-grid-item' data-col-span='1' data-row-span='2' data-col-start='1' data-row-start='3'><h2>5+</h2><p>Лет опыта</p></div><div data-type='bento-grid-item' data-col-span='1' data-row-span='1' data-col-start='2' data-row-start='3'><h2>50K</h2><p>Активных пользователей</p></div><div data-type='bento-grid-item' data-col-span='1' data-row-span='2' data-col-start='3' data-row-start='3'><h2>12</h2><p>Стран присутствия</p></div><div data-type='bento-grid-item' data-col-span='1' data-row-span='1' data-col-start='2' data-row-start='4'><h2>3x</h2><p>Рост прибыли</p></div></div>",
    icon: LayoutGrid,
  },
  {
    title: "Таблица",
    id: "table",
    group: "table",
    content:
      "<table><tr><th>Колонка 1</th><th>Колонка 2</th></tr><tr><td>Контент колонки 1</td><td>Контент колонки 2</td></tr></table>",
    icon: Table,
  },
  {
    title: "Столбчатый график",
    id: "chart-bar",
    group: "diagram",
    content:
      '<div data-type=\'chart\' data-chart-type=\'bar\' data-show-labels=\'true\' data-data=\'[[{"value":"Фрукты"},{"value":"Количество"}],[{"value":"Яблоки"},{"value":"45"}],[{"value":"Бананы"},{"value":"60"}],[{"value":"Апельсины"},{"value":"40"}],[{"value":"Виноград"},{"value":"25"}],[{"value":"Персики"},{"value":"35"}]]\'>Chart Data</div>',
    icon: ChartColumnBig,
  },
  {
    title: "Горизонтальный график",
    id: "chart-h-bar",
    group: "diagram",
    content:
      '<div data-type=\'chart\' data-chart-type=\'h-bar\' data-show-labels=\'true\' data-data=\'[[{"value":"Фрукты"},{"value":"Количество"}],[{"value":"Яблоки"},{"value":"45"}],[{"value":"Бананы"},{"value":"60"}],[{"value":"Апельсины"},{"value":"40"}],[{"value":"Виноград"},{"value":"25"}],[{"value":"Персики"},{"value":"35"}]]\'>Chart Data</div>',
    icon: ChartBarBig,
  },
  {
    title: "Линейный график",
    id: "chart-line",
    group: "diagram",
    content:
      '<div data-type=\'chart\' data-chart-type=\'line\' data-show-labels=\'true\' data-data=\'[[{"value":"Месяц"},{"value":"Продажи"}],[{"value":"Январь"},{"value":"2000"}],[{"value":"Февраль"},{"value":"3000"}],[{"value":"Март"},{"value":"2500"}],[{"value":"Апрель"},{"value":"3500"}],[{"value":"Май"},{"value":"4000"}]]\'>Chart Data</div>',
    icon: ChartLine,
  },
  {
    title: "Круговая диаграмма",
    id: "chart-pie",
    group: "diagram",
    content:
      '<div data-type=\'chart\' data-chart-type=\'pie\' data-show-labels=\'true\' data-data=\'[[{"value":"Категория"},{"value":"Доля"}],[{"value":"A"},{"value":"30"}],[{"value":"B"},{"value":"25"}],[{"value":"C"},{"value":"20"}],[{"value":"D"},{"value":"15"}],[{"value":"E"},{"value":"10"}]]\'>Chart Data</div>',
    icon: ChartPie,
  },
  {
    title: "Кольцевая диаграмма",
    id: "chart-donut",
    group: "diagram",
    content:
      '<div data-type=\'chart\' data-chart-type=\'donut\' data-show-labels=\'true\' data-data=\'[[{"value":"Категория"},{"value":"Доля"}],[{"value":"A"},{"value":"30"}],[{"value":"B"},{"value":"25"}],[{"value":"C"},{"value":"20"}],[{"value":"D"},{"value":"15"}],[{"value":"E"},{"value":"10"}]]\'>Chart Data</div>',
    icon: IconChartDonut3,
  },
  {
    title: "График площади",
    id: "chart-area",
    group: "diagram",
    content:
      '<div data-type=\'chart\' data-chart-type=\'area\' data-show-labels=\'true\' data-data=\'[[{"value":"Период"},{"value":"Показатель"}],[{"value":"Q1"},{"value":"1000"}],[{"value":"Q2"},{"value":"1500"}],[{"value":"Q3"},{"value":"1200"}],[{"value":"Q4"},{"value":"2000"}]]\'>Chart Data</div>',
    icon: ChartArea,
  },
  {
    title: "Радар-диаграмма",
    id: "chart-radar",
    group: "diagram",
    content:
      '<div data-type=\'chart\' data-chart-type=\'radar\' data-show-labels=\'true\' data-data=\'[[{"value":"Категория"},{"value":"Значение"}],[{"value":"A"},{"value":"80"}],[{"value":"B"},{"value":"65"}],[{"value":"C"},{"value":"75"}],[{"value":"D"},{"value":"90"}],[{"value":"E"},{"value":"70"}]]\'>Chart Data</div>',
    icon: IconChartRadar,
  },
  {
    title: "Радиальный график",
    id: "chart-radial-bar",
    group: "diagram",
    content:
      '<div data-type=\'chart\' data-chart-type=\'radial-bar\' data-show-labels=\'true\' data-data=\'[[{"value":"Категория"},{"value":"Значение"}],[{"value":"A"},{"value":"80"}],[{"value":"B"},{"value":"65"}],[{"value":"C"},{"value":"75"}],[{"value":"D"},{"value":"90"}],[{"value":"E"},{"value":"70"}]]\'>Chart Data</div>',
    icon: IconRadar2,
  },
  {
    title: "Список преимуществ",
    id: "features-list",
    group: "layout",
    content:
      "<div data-type='features-list'><div data-type='feature' data-title='Заголовок' data-content='Описание'></div><div data-type='feature' data-title='Заголовок' data-content='Описание'></div></div>",
    icon: List,
  },
  {
    title: "Таймлайн",
    id: "timeline",
    group: "layout",
    content:
      "<div data-type='timeline' data-direction='vertical' data-show-numbers='on'><div data-type='timeline-item' data-title='Заголовок' data-content='Описание'></div><div data-type='timeline-item' data-title='Заголовок' data-content='Описание'></div></div>",
    icon: Calendar,
  },
  {
    title: "Стрелки",
    id: "smart-layout-arrows",
    group: "layout",
    content:
      "<div data-type='smart-layout' data-smart-layout-type='arrows'><div data-type='smart-layout-item' data-smart-layout-type='arrows'><p>Элемент 1</p></div><div data-type='smart-layout-item' data-smart-layout-type='arrows'><p>Элемент 2</p></div></div>",
    icon: ArrowRight,
  },
  {
    title: "Стрелки вниз",
    id: "smart-layout-arrows-down",
    group: "layout",
    content:
      "<div data-type='smart-layout' data-smart-layout-type='arrows-down'><div data-type='smart-layout-item' data-smart-layout-type='arrows-down'><p>Элемент 1</p></div><div data-type='smart-layout-item' data-smart-layout-type='arrows-down'><p>Элемент 2</p></div></div>",
    icon: ArrowDown,
  },
  {
    title: "Статистика",
    id: "smart-layout-statistics",
    group: "layout",
    content:
      "<div data-type='smart-layout' data-smart-layout-type='statistics'><div data-type='smart-layout-item' data-smart-layout-type='statistics'><p>Элемент 1</p></div><div data-type='smart-layout-item' data-smart-layout-type='statistics'><p>Элемент 2</p></div></div>",
    icon: BarChart3,
  },
  {
    title: "Большие числа",
    id: "smart-layout-big-numbers",
    group: "layout",
    content:
      "<div data-type='smart-layout' data-smart-layout-type='big-numbers'><div data-type='smart-layout-item' data-smart-layout-type='big-numbers'><p>Элемент 1</p></div><div data-type='smart-layout-item' data-smart-layout-type='big-numbers'><p>Элемент 2</p></div></div>",
    icon: Percent,
  },
  {
    title: "Рейтинг",
    id: "smart-layout-rating-stars",
    group: "layout",
    content:
      "<div data-type='smart-layout' data-smart-layout-type='raiting-stars'><div data-type='smart-layout-item' data-smart-layout-type='raiting-stars'><p>Элемент 1</p></div><div data-type='smart-layout-item' data-smart-layout-type='raiting-stars'><p>Элемент 2</p></div></div>",
    icon: Star,
  },
  {
    title: "Пирамида",
    id: "smart-layout-pyramid",
    group: "layout",
    content:
      "<div data-type='smart-layout' data-smart-layout-type='pyramid'><div data-type='smart-layout-item' data-smart-layout-type='pyramid'><p>Уровень 1</p></div><div data-type='smart-layout-item' data-smart-layout-type='pyramid'><p>Уровень 2</p></div></div>",
    icon: Triangle,
  },
  {
    title: "Воронка",
    id: "smart-layout-funnel",
    group: "layout",
    content:
      "<div data-type='smart-layout' data-smart-layout-type='funnel'><div data-type='smart-layout-item' data-smart-layout-type='funnel'><p>Элемент 1</p></div><div data-type='smart-layout-item' data-smart-layout-type='funnel'><p>Элемент 2</p></div></div>",
    icon: Filter,
  },
  {
    title: "Цитаты",
    id: "smart-layout-quotes",
    group: "layout",
    content:
      "<div data-type='smart-layout' data-smart-layout-type='quotes'><div data-type='smart-layout-item' data-smart-layout-type='quotes'><p>Элемент 1</p></div><div data-type='smart-layout-item' data-smart-layout-type='quotes'><p>Элемент 2</p></div></div>",
    icon: Quote,
  },
  {
    title: "Иерархическое дерево",
    id: "flowchart",
    group: "diagram",
    content:
      '<div data-type=\'flowchart\' data-data=\'[{"content":"<p>Родитель</p>","children":[{"content":"<p>Дочерний элемент</p>","children":[{"content":"<p>Внук</p>"}]},{"content":"<p>Дочерний элемент</p>","children":[{"content":"<p>Внук</p>"},{"content":"<p>Внук</p>","children":[{"content":"<p>Правнук</p>"},{"content":"<p>Правнук</p>"},{"content":"<p>Правнук</p>"}]},{"content":"<p>Внук</p>"}]}]}]\'>Flowchart Data</div>',
    icon: GitBranch,
  },
] as const;
