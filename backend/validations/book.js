import Joi from 'joi';

// Định nghĩa schema validate cho dữ liệu sách
export const bookValidator = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Tên sách phải là một chuỗi.',
    'string.empty': 'Tên sách không được để trống.',
    'string.min': 'Tên sách phải có ít nhất 3 ký tự.',
    'string.max': 'Tên sách không được quá 100 ký tự.',
    'any.required': 'Tên sách là bắt buộc.'
  }),
  author: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Tên tác giả phải là một chuỗi.',
    'string.empty': 'Tên tác giả không được để trống.',
    'string.min': 'Tên tác giả phải có ít nhất 3 ký tự.',
    'string.max': 'Tên tác giả không được quá 100 ký tự.',
    'any.required': 'Tên tác giả là bắt buộc.'
  }),
  price: Joi.number().min(1).required().messages({
    'number.base': 'Giá phải là một số.',
    'number.min': 'Giá lớn hơn 0.',
    'any.required': 'Giá là bắt buộc.'
  }),
  image: Joi.string().uri().optional().messages({
    'string.base': 'Đường dẫn ảnh phải là một chuỗi.',
    'string.uri': 'Đường dẫn ảnh phải là một URL hợp lệ.'
  }),
});
