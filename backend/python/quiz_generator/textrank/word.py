from .utils import scan_vocabulary
from .utils import tokenize_sents

def word_graph(sents, tokenize=None, min_count=2, window=2,
    min_cooccurrence=2, vocab_to_idx=None, verbose=False):

    if vocab_to_idx is None:
        idx_to_vocab, vocab_to_idx = scan_vocabulary(sents, tokenize, min_count)
    else:
        idx_to_vocab = [vocab for vocab, _ in sorted(vocab_to_idx.items(), key=lambda x:x[1])]

    tokens = tokenize_sents(sents, tokenize)
    g = cooccurrence(tokens, vocab_to_idx, window, min_cooccurrence, verbose)
    return g, idx_to_vocab
