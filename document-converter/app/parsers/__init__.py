"""Document parser module"""
from typing import Type
from .base import BaseParser
from .docx_parser import DocxParser
from .odt_parser import OdtParser

# Parser registry
PARSERS = {
    '.docx': DocxParser,
    '.doc': DocxParser,  # Will use mammoth which handles .doc files too
    '.odt': OdtParser,
    '.rtf': DocxParser  # Mammoth can handle RTF
}


def get_parser(extension: str) -> BaseParser:
    """Get parser instance for file extension"""
    parser_class = PARSERS.get(extension)
    if not parser_class:
        raise ValueError(f"No parser available for extension: {extension}")
    return parser_class()


__all__ = ['BaseParser', 'DocxParser', 'OdtParser', 'get_parser']