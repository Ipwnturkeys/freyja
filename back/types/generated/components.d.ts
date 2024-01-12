import type { Schema, Attribute } from '@strapi/strapi';

export interface CardCard extends Schema.Component {
  collectionName: 'components_card_cards';
  info: {
    displayName: 'Card';
    icon: 'alien';
  };
  attributes: {
    Title: Attribute.String;
    Content: Attribute.RichText;
    Image: Attribute.Media;
  };
}

export interface QuestionQuestion extends Schema.Component {
  collectionName: 'components_question_questions';
  info: {
    displayName: 'Question';
    icon: 'question';
  };
  attributes: {
    Title: Attribute.String;
    Content: Attribute.Blocks;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'card.card': CardCard;
      'question.question': QuestionQuestion;
    }
  }
}
